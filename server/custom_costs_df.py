import pandas as pd

OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3


def compute_custom_numbers(ticker, val_a, val_b):
    if pd.isna(val_a) or pd.isna(val_b):
        return None

    if ticker == "РТС":
        return round(val_a + val_b / 10, ROUND_PRECISION)
    if ticker in {"SCNYR", "SUSDR", "SEURR"}:
        return round(val_a + val_b, ROUND_PRECISION)

    return None


def build_custom_numbers_dataframe(ticker, base_numbers_dfs):
    empty_columns = ["tradedate", "clgroup", "pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]
    if len(base_numbers_dfs) != 2:
        return pd.DataFrame(columns=empty_columns)

    df_a, df_b = base_numbers_dfs[0], base_numbers_dfs[1]

    if df_a.empty or df_b.empty:
        return pd.DataFrame(columns=empty_columns)

    merge_keys = ["tradedate", "clgroup"]
    if not all(key in df_a.columns and key in df_b.columns for key in merge_keys):
        return pd.DataFrame(columns=empty_columns)

    df = df_a.merge(df_b, on=merge_keys, how="outer", suffixes=("_a", "_b"))

    if df.empty:
        return pd.DataFrame(columns=empty_columns)

    numeric_fields = ["pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]

    for field in numeric_fields:
        col_a = f"{field}_a"
        col_b = f"{field}_b"
        if col_a in df.columns and col_b in df.columns:
            df[field] = df.apply(lambda row: compute_custom_numbers(ticker, row[col_a], row[col_b]), axis=1)
            df = df.drop(columns=[col_a, col_b])

    return df


def build_custom_costs_dataframe(ticker, base_cost_dfs):
    if len(base_cost_dfs) == 2:
        df = base_cost_dfs[0].merge(
            base_cost_dfs[1],
            on="tradedate",
            how="outer",
            suffixes=("_a", "_b"),
        )
    else:
        df = None

    def compute_custom_cost(row):
        a = row.get("cost_a")
        b = row.get("cost_b")

        if ticker == "ED":
            if a is None or b in (None, 0):
                return None
            return round(a / b, ROUND_PRECISION)
        if ticker in {"GD", "SV", "PT", "PD"}:
            if a is None or b in (None, 0):
                return None
            return round(a * OUNCE_IN_GRAMS / b, ROUND_PRECISION)
        if ticker == "UC":
            if a is None or b in (None, 0):
                return None
            return round(a / b, ROUND_PRECISION)
        if ticker == "РТС":
            if a is None or b is None:
                return None
            return round(a + b / 10, ROUND_PRECISION)
        if ticker in {"SCNYR", "SUSDR", "SEURR"}:
            if a is None or b is None:
                return None
            return round(a + b, ROUND_PRECISION)
        return None

    df["cost"] = df.apply(compute_custom_cost, axis=1)

    return (
        df[["tradedate", "cost"]]
        .sort_values(by="tradedate", ascending=True)
        .reset_index(drop=True)
    )
