from dataclasses import dataclass


@dataclass
class TickerInfo:
    ticker: str
    url: str


cost_mapping = {
    "AF": TickerInfo("AFLT", ""),
    "AL": TickerInfo("ALRS", ""),
    "BR": TickerInfo("BR", ""),
    "CNYRUBF": TickerInfo("CNYRUBF", "futures"),
    "CR": TickerInfo("CNYRUBF", "futures"),
    "Eu": TickerInfo("EURRUBF", "futures"),
    "EURRUBF": TickerInfo("EURRUBF", "futures"),
    "GAZPF": TickerInfo("GAZP", ""),
    "GL": TickerInfo("GLDRUBF", "futures"),
    "GK": TickerInfo("GMKN", ""),
    "GLDRUBF": TickerInfo("GLDRUBF", "futures"),
    "GZ": TickerInfo("GAZP", ""),
    "HS": TickerInfo("2800", ""),
    "HY": TickerInfo("HYDR", ""),
    "IMOEXF": TickerInfo("IMOEXF", "futures"),
    "LK": TickerInfo("LKOH", ""),
    "ME": TickerInfo("MOEX", ""),
    "MG": TickerInfo("MAGN", ""),
    "ML": TickerInfo("VKCO", ""),
    "MM": TickerInfo("IMOEX", ""),
    "MN": TickerInfo("MGNT", ""),
    "MX": TickerInfo("IMOEX", "futures"),
    "MY": TickerInfo("IMOEXCNY", ""),
    "NK": TickerInfo("NVTK", ""),
    "NM": TickerInfo("NLMK", ""),
    "RB": TickerInfo("RGBI", ""),
    "RI": TickerInfo("RTSI", ""),
    "RM": TickerInfo("RTSI", ""),
    "RN": TickerInfo("ROSN", ""),
    "SBERF": TickerInfo("SBER", ""),
    "Si": TickerInfo("USDRUBF", "futures"),
    "SN": TickerInfo("SNGS", ""),
    "SP": TickerInfo("SBERP", ""),
    "SR": TickerInfo("SBER", ""),
    "TT": TickerInfo("TATN", ""),
    "TN": TickerInfo("T", ""),
    "USDRUBF": TickerInfo("USDRUBF", "futures"),
    "VB": TickerInfo("VTBR", ""),
    "VI": TickerInfo("RVI", ""),
    "X5": TickerInfo("X5", ""),
    "YD": TickerInfo("YDEX", ""),
    "W4": TickerInfo("W4", "")
}
