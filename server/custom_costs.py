def build_custom_candles(builder, *responses):
    return {"candles": builder(*responses)}


def build_custom_costs_ED(resp_costs_eu, resp_costs_si):
    cols_eu = resp_costs_eu["candles"]["columns"]
    cols_si = resp_costs_si["candles"]["columns"]
    data_eu = resp_costs_eu["candles"]["data"]
    data_si = resp_costs_si["candles"]["data"]

    idx_close_eu = cols_eu.index("close")
    idx_begin_eu = cols_eu.index("begin")
    idx_close_si = cols_si.index("close")

    rows = []
    for row_eu, row_si in zip(data_eu, data_si):
        cost_eu = row_eu[idx_close_eu]
        cost_si = row_si[idx_close_si]
        traded_begin = row_eu[idx_begin_eu]

        if cost_eu is None or cost_si in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_eu / cost_si, 3)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_ED(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_eu, base_si = base_codes
    resp_costs_eu = fetcher(base_eu, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_ED, resp_costs_eu, resp_costs_si)


def build_custom_costs_GD(resp_costs_gl, resp_costs_si):
    cols_gl = resp_costs_gl["candles"]["columns"]
    cols_si = resp_costs_si["candles"]["columns"]
    data_gl = resp_costs_gl["candles"]["data"]
    data_si = resp_costs_si["candles"]["data"]

    idx_close_gl = cols_gl.index("close")
    idx_begin_gl = cols_gl.index("begin")
    idx_close_si = cols_si.index("close")

    rows = []
    for row_gl, row_si in zip(data_gl, data_si):
        cost_gl = row_gl[idx_close_gl]
        cost_si = row_si[idx_close_si]
        traded_begin = row_gl[idx_begin_gl]

        if cost_gl is None or cost_si in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_gl * 31.1034768 / cost_si, 3)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_GD(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_gl, base_si = base_codes
    resp_costs_gl = fetcher(base_gl, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_GD, resp_costs_gl, resp_costs_si)


def build_custom_costs_SV(resp_costs_sv, resp_costs_si):
    cols_sv = resp_costs_sv["candles"]["columns"]
    cols_si = resp_costs_si["candles"]["columns"]
    data_sv = resp_costs_sv["candles"]["data"]
    data_si = resp_costs_si["candles"]["data"]

    idx_close_sv = cols_sv.index("close")
    idx_begin_sv = cols_sv.index("begin")
    idx_close_si = cols_si.index("close")

    rows = []
    for row_sv, row_si in zip(data_sv, data_si):
        cost_sv = row_sv[idx_close_sv]
        cost_si = row_si[idx_close_si]
        traded_begin = row_sv[idx_begin_sv]

        if cost_sv is None or cost_si in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_sv * 31.1034768 / cost_si, 3)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_SV(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_sv, base_si = base_codes
    resp_costs_sv = fetcher(base_sv, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_SV, resp_costs_sv, resp_costs_si)
