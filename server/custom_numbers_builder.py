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


def _apply_formula(formula, *values):
    if any(pd.isna(val) for val in values):
        return None
    result = formula(*values)
    return round(result, ROUND_PRECISION) if result is not None else None


def compute_custom_numbers(ticker, val_a, val_b, val_c=None):
    formula = SYNTHETIC_FORMULAS.get(ticker)
    if formula is None:
        return None
    return _apply_formula(formula, val_a, val_b, val_c) if val_c is not None else _apply_formula(formula, val_a, val_b)


def _get_expected_count(ticker):
    return len(cost_mapping[ticker].asset_code) if ticker in cost_mapping else 2


def _merge_dataframes(base_dfs, merge_keys, expected_count):
    df = base_dfs[0].merge(base_dfs[1], on=merge_keys, how="outer", suffixes=("_a", "_b"))
    if expected_count == 3:
        df = df.merge(base_dfs[2], on=merge_keys, how="outer", suffixes=("", "_c"))
    return df


def build_custom_numbers_dataframe(ticker, base_numbers_dfs):
    empty_columns = ["tradedate", "clgroup", "pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]
    expected_count = _get_expected_count(ticker)

    if len(base_numbers_dfs) != expected_count or any(df.empty for df in base_numbers_dfs):
        return pd.DataFrame(columns=empty_columns)

    merge_keys = ["tradedate", "clgroup"]
    if not all(all(key in df.columns for df in base_numbers_dfs) for key in merge_keys):
        return pd.DataFrame(columns=empty_columns)

    df = _merge_dataframes(base_numbers_dfs, merge_keys, expected_count)
    if df.empty:
        return pd.DataFrame(columns=empty_columns)

    numeric_fields = ["pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num"]
    for field in numeric_fields:
        cols = [f"{field}_a", f"{field}_b"] + ([f"{field}_c"] if expected_count == 3 else [])
        if all(col in df.columns for col in cols):
            df[field] = df.apply(
                lambda row: compute_custom_numbers(ticker, *[row[col] for col in cols]),
                axis=1
            )
            df = df.drop(columns=cols)

    return df


def build_custom_costs_dataframe(ticker, base_cost_dfs):
    expected_count = _get_expected_count(ticker)

    if len(base_cost_dfs) != expected_count:
        return pd.DataFrame(columns=["tradedate", "cost"])

    merge_keys = ["tradedate"]
    if expected_count == 3:
        base_cost_dfs = base_cost_dfs[:2] + [base_cost_dfs[2].rename(columns={"cost": "cost_c"})]

    df = _merge_dataframes(base_cost_dfs, merge_keys, expected_count)

    formula = COST_FORMULAS.get(ticker)
    if formula is None:
        return pd.DataFrame(columns=["tradedate", "cost"])

    def compute_custom_cost(row):
        values = [row.get("cost_a"), row.get("cost_b")]
        if expected_count == 3:
            values.append(row.get("cost_c"))
        return _apply_formula(formula, *values)

    df["cost"] = df.apply(compute_custom_cost, axis=1)

    return (
        df[["tradedate", "cost"]]
        .sort_values(by="tradedate", ascending=True)
        .reset_index(drop=True)
    )
