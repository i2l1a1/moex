OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3


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
        return None

    df["cost"] = df.apply(compute_custom_cost, axis=1)

    return (
        df[["tradedate", "cost"]]
        .sort_values(by="tradedate", ascending=True)
        .reset_index(drop=True)
    )
