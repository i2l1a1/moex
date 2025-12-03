OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3


def build_custom_candles(builder, *responses):
    return {"candles": builder(*responses)}


def fetch_custom_costs_pair(builder, fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_a, base_b = base_codes
    resp_a = fetcher(base_a, moex_api_base_url, cur_from, cur_till, headers)
    resp_b = fetcher(base_b, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(builder, resp_a, resp_b)


def build_custom_costs_pair(resp_a, resp_b, compute_synthetic_value_fn):
    cols_a = resp_a["candles"]["columns"]
    cols_b = resp_b["candles"]["columns"]
    data_a = resp_a["candles"]["data"]
    data_b = resp_b["candles"]["data"]

    idx_close_a = cols_a.index("close")
    idx_begin_a = cols_a.index("begin")
    idx_close_b = cols_b.index("close")

    rows = []
    for row_a, row_b in zip(data_a, data_b):
        cost_a = row_a[idx_close_a]
        cost_b = row_b[idx_close_b]
        traded_begin = row_a[idx_begin_a]
        synthetic_cost = compute_synthetic_value_fn(cost_a, cost_b)
        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def build_custom_costs_ED(resp_costs_eu, resp_costs_si):
    def compute_synthetic_value(cost_eu, cost_si):
        if cost_eu is None or cost_si in (0, None):
            return None
        return round(cost_eu / cost_si, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_eu, resp_costs_si, compute_synthetic_value)


def fetch_custom_costs_ED(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_ED, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_costs_GD(resp_costs_gl, resp_costs_si):
    def compute_synthetic_value(cost_gl, cost_si):
        if cost_gl is None or cost_si in (0, None):
            return None
        return round(cost_gl * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_gl, resp_costs_si, compute_synthetic_value)


def fetch_custom_costs_GD(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_GD, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_costs_SV(resp_costs_sv, resp_costs_si):
    def compute_synthetic_value(cost_sv, cost_si):
        if cost_sv is None or cost_si in (0, None):
            return None
        return round(cost_sv * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_sv, resp_costs_si, compute_synthetic_value)


def fetch_custom_costs_SV(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_SV, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_costs_PT(resp_costs_pt, resp_costs_si):
    def compute_synthetic_value(cost_pt, cost_si):
        if cost_pt is None or cost_si in (0, None):
            return None
        return round(cost_pt * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_pt, resp_costs_si, compute_synthetic_value)


def fetch_custom_costs_PT(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_PT, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_costs_PD(resp_costs_pd, resp_costs_si):
    def compute_synthetic_value(cost_pd, cost_si):
        if cost_pd is None or cost_si in (0, None):
            return None
        return round(cost_pd * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_pd, resp_costs_si, compute_synthetic_value)


def fetch_custom_costs_PD(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_PD, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_costs_UC(resp_costs_si, resp_costs_cr):
    def compute_synthetic_value(cost_si, cost_cr):
        if cost_si is None or cost_cr in (0, None):
            return None
        return round(cost_si / cost_cr, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_si, resp_costs_cr, compute_synthetic_value)


def fetch_custom_costs_UC(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_UC, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)
