import requests

OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3


def build_custom_candles(builder, *responses):
    return {"candles": builder(*responses)}


def fetch_custom_costs_pair(builder, fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_a, base_b = base_codes
    resp_a = fetcher(base_a, moex_api_base_url, cur_from, cur_till, headers)
    resp_b = fetcher(base_b, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(builder, resp_a, resp_b)


def build_custom_numbers_pair(resp_a, resp_b, compute_fn):
    cols_a = resp_a["futoi"]["columns"]
    cols_b = resp_b["futoi"]["columns"]
    data_a = resp_a["futoi"]["data"]
    data_b = resp_b["futoi"]["data"]

    target_fields = ("pos", "pos_long", "pos_short", "pos_long_num", "pos_short_num")

    idx_a = {name: i for i, name in enumerate(cols_a)}
    idx_b = {name: i for i, name in enumerate(cols_b)}

    rows_b_by_key = {
        (row[idx_b["tradedate"]], row[idx_b["clgroup"]]): row
        for row in data_b
    }

    merged_rows = []
    for row_a in data_a:
        key = (row_a[idx_a["tradedate"]], row_a[idx_a["clgroup"]])
        row_b = rows_b_by_key.get(key)
        if row_b is None:
            continue

        new_row = list(row_a)
        for field in target_fields:
            va = row_a[idx_a[field]]
            vb = row_b[idx_b[field]]
            new_row[idx_a[field]] = None if va is None or vb is None else compute_fn(va, vb)

        merged_rows.append(new_row)

    return {"futoi": {"columns": cols_a, "data": merged_rows}}


def fetch_custom_numbers_pair(builder, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_a, base_b = base_codes
    url_a = f"{moex_api_base_url}/iss/analyticalproducts/futoi/securities/{base_a}.json?from={cur_from}&till={cur_till}&latest=1"
    url_b = f"{moex_api_base_url}/iss/analyticalproducts/futoi/securities/{base_b}.json?from={cur_from}&till={cur_till}&latest=1"

    resp_a = requests.get(url_a, headers=headers).json()
    resp_b = requests.get(url_b, headers=headers).json()

    return builder(resp_a, resp_b)


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


def build_custom_costs_RTS(resp_costs_ri, resp_costs_rm):
    def compute_synthetic_value(cost_ri, cost_rm):
        if cost_ri is None or cost_rm is None:
            return None
        return round(cost_ri + cost_rm / 10, ROUND_PRECISION)

    return build_custom_costs_pair(resp_costs_ri, resp_costs_rm, compute_synthetic_value)


def fetch_custom_costs_RTS(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_costs_pair(build_custom_costs_RTS, fetcher, base_codes, moex_api_base_url, cur_from, cur_till,
                                   headers)


def build_custom_numbers_RTS(resp_numbers_ri, resp_numbers_rm):
    def compute(val_ri, val_rm):
        return round(val_ri + val_rm / 10, ROUND_PRECISION)

    return build_custom_numbers_pair(resp_numbers_ri, resp_numbers_rm, compute)


def fetch_custom_numbers_RTS(base_codes, moex_api_base_url, cur_from, cur_till, headers):
    return fetch_custom_numbers_pair(build_custom_numbers_RTS, base_codes, moex_api_base_url, cur_from, cur_till,
                                     headers)
