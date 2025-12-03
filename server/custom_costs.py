OUNCE_IN_GRAMS = 31.1034768
ROUND_PRECISION = 3


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
            synthetic_cost = round(cost_gl * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

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
            synthetic_cost = round(cost_sv * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_SV(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_sv, base_si = base_codes
    resp_costs_sv = fetcher(base_sv, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_SV, resp_costs_sv, resp_costs_si)


def build_custom_costs_PT(resp_costs_pt, resp_costs_si):
    cols_pt = resp_costs_pt["candles"]["columns"]
    cols_si = resp_costs_si["candles"]["columns"]
    data_pt = resp_costs_pt["candles"]["data"]
    data_si = resp_costs_si["candles"]["data"]

    idx_close_pt = cols_pt.index("close")
    idx_begin_pt = cols_pt.index("begin")
    idx_close_si = cols_si.index("close")

    rows = []
    for row_pt, row_si in zip(data_pt, data_si):
        cost_pt = row_pt[idx_close_pt]
        cost_si = row_si[idx_close_si]
        traded_begin = row_pt[idx_begin_pt]

        if cost_pt is None or cost_si in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_pt * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_PT(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_pt, base_si = base_codes
    resp_costs_pt = fetcher(base_pt, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_PT, resp_costs_pt, resp_costs_si)


def build_custom_costs_PD(resp_costs_pd, resp_costs_si):
    cols_pd = resp_costs_pd["candles"]["columns"]
    cols_si = resp_costs_si["candles"]["columns"]
    data_pd = resp_costs_pd["candles"]["data"]
    data_si = resp_costs_si["candles"]["data"]

    idx_close_pd = cols_pd.index("close")
    idx_begin_pd = cols_pd.index("begin")
    idx_close_si = cols_si.index("close")

    rows = []
    for row_pd, row_si in zip(data_pd, data_si):
        cost_pd = row_pd[idx_close_pd]
        cost_si = row_si[idx_close_si]
        traded_begin = row_pd[idx_begin_pd]

        if cost_pd is None or cost_si in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_pd * OUNCE_IN_GRAMS / cost_si, ROUND_PRECISION)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_PD(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_pd, base_si = base_codes
    resp_costs_pd = fetcher(base_pd, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_PD, resp_costs_pd, resp_costs_si)


def build_custom_costs_UC(resp_costs_si, resp_costs_cr):
    cols_si = resp_costs_si["candles"]["columns"]
    cols_cr = resp_costs_cr["candles"]["columns"]
    data_si = resp_costs_si["candles"]["data"]
    data_cr = resp_costs_cr["candles"]["data"]

    idx_close_si = cols_si.index("close")
    idx_begin_si = cols_si.index("begin")
    idx_close_cr = cols_cr.index("close")

    rows = []
    for row_si, row_cr in zip(data_si, data_cr):
        cost_si = row_si[idx_close_si]
        cost_cr = row_cr[idx_close_cr]
        traded_begin = row_si[idx_begin_si]

        if cost_si is None or cost_cr in (0, None):
            synthetic_cost = None
        else:
            synthetic_cost = round(cost_si / cost_cr, ROUND_PRECISION)

        rows.append([synthetic_cost, traded_begin])

    return {"columns": ["close", "begin"], "data": rows}


def fetch_custom_costs_UC(fetcher, base_codes, moex_api_base_url, cur_from, cur_till, headers):
    base_si, base_cr = base_codes
    resp_costs_si = fetcher(base_si, moex_api_base_url, cur_from, cur_till, headers)
    resp_costs_cr = fetcher(base_cr, moex_api_base_url, cur_from, cur_till, headers)
    return build_custom_candles(build_custom_costs_UC, resp_costs_si, resp_costs_cr)
