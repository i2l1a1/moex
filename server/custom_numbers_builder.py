import pandas as pd
from data_mapping import cost_mapping

OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3

SYNTHETIC_FORMULAS = {
    "РТС": lambda a, b, c=None: a + b / 10,
    "SCNYR": lambda a, b, c=None: a + b,
    "SUSDR": lambda a, b, c=None: a + b,
    "SEURR": lambda a, b, c=None: a + b,
    "SMOEX": lambda a, b, c: a + b / 10 + c / 10,
}

COST_FORMULAS = {
    "ED": lambda a, b, c=None: a / b if b not in (None, 0) else None,
    "GD": lambda a, b, c=None: a * OUNCE_IN_GRAMS / b if b not in (None, 0) else None,
    "SV": lambda a, b, c=None: a * OUNCE_IN_GRAMS / b if b not in (None, 0) else None,
    "PT": lambda a, b, c=None: a * OUNCE_IN_GRAMS / b if b not in (None, 0) else None,
    "PD": lambda a, b, c=None: a * OUNCE_IN_GRAMS / b if b not in (None, 0) else None,
    "UC": lambda a, b, c=None: a / b if b not in (None, 0) else None,
    **SYNTHETIC_FORMULAS,
}

synthetic_tickers = SYNTHETIC_FORMULAS.keys()


def compute_custom_numbers(ticker, val_a, val_b, val_c=None):
    formula = SYNTHETIC_FORMULAS.get(ticker)
    if formula is None:
        return None

    if val_c is None:
        if pd.isna(val_a) or pd.isna(val_b):
            return None
        return round(formula(val_a, val_b), ROUND_PRECISION)
    else:
        if pd.isna(val_a) or pd.isna(val_b) or pd.isna(val_c):
            return None
        return round(formula(val_a, val_b, val_c), ROUND_PRECISION)


def build_custom_numbers_dataframe(ticker, base_numbers_dfs):
    empty_columns = ["tradedate", "clgroup", "pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]

    expected_count = len(cost_mapping[ticker].asset_code) if ticker in cost_mapping else 2
    if len(base_numbers_dfs) != expected_count:
        return pd.DataFrame(columns=empty_columns)

    if any(df.empty for df in base_numbers_dfs):
        return pd.DataFrame(columns=empty_columns)

    merge_keys = ["tradedate", "clgroup"]
    if not all(all(key in df.columns for df in base_numbers_dfs) for key in merge_keys):
        return pd.DataFrame(columns=empty_columns)

    df = base_numbers_dfs[0].merge(
        base_numbers_dfs[1],
        on=merge_keys,
        how="outer",
        suffixes=("_a", "_b")
    )

    if expected_count == 3:
        df = df.merge(
            base_numbers_dfs[2],
            on=merge_keys,
            how="outer",
            suffixes=("", "_c")
        )

    if df.empty:
        return pd.DataFrame(columns=empty_columns)

    numeric_fields = ["pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]

    for field in numeric_fields:
        cols = [f"{field}_a", f"{field}_b"]
        if expected_count == 3:
            cols.append(f"{field}_c")

        if all(col in df.columns for col in cols):
            if expected_count == 3:
                df[field] = df.apply(
                    lambda row: compute_custom_numbers(ticker, row[cols[0]], row[cols[1]], row[cols[2]]),
                    axis=1
                )
            else:
                df[field] = df.apply(
                    lambda row: compute_custom_numbers(ticker, row[cols[0]], row[cols[1]]),
                    axis=1
                )
            df = df.drop(columns=cols)

    return df


def build_custom_costs_dataframe(ticker, base_cost_dfs):
    expected_count = len(cost_mapping[ticker].asset_code) if ticker in cost_mapping else 2

    if len(base_cost_dfs) != expected_count:
        return pd.DataFrame(columns=["tradedate", "cost"])

    df = base_cost_dfs[0].merge(
        base_cost_dfs[1],
        on="tradedate",
        how="outer",
        suffixes=("_a", "_b"),
    )

    if expected_count == 3:
        df_c_renamed = base_cost_dfs[2].rename(columns={"cost": "cost_c"})
        df = df.merge(df_c_renamed, on="tradedate", how="outer")

    def compute_custom_cost(row):
        a = row.get("cost_a")
        b = row.get("cost_b")
        c = row.get("cost_c") if expected_count == 3 else None

        formula = COST_FORMULAS.get(ticker)
        if formula is None:
            return None

        if expected_count == 3:
            if a is None or b is None or c is None:
                return None
            result = formula(a, b, c)
        else:
            if a is None or b is None:
                return None
            result = formula(a, b)

        if result is None:
            return None
        return round(result, ROUND_PRECISION)

    df["cost"] = df.apply(compute_custom_cost, axis=1)

    return (
        df[["tradedate", "cost"]]
        .sort_values(by="tradedate", ascending=True)
        .reset_index(drop=True)
    )
