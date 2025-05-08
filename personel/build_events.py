
"""
build_events.py — تولید فایل events.json از منابع رسمی
-----------------------------------------------------
نیازمند: requests, ics, beautifulsoup4, python-dateutil

pip install requests ics beautifulsoup4 python-dateutil
python build_events.py
خروجی در همان دایرکتوری: events.json
"""

import requests, json, datetime
from dateutil import parser
from ics import Calendar
from bs4 import BeautifulSoup

OUT = {"solar": {}, "gregorian": {}, "islamic": {}, "zoroastrian": {}, "jewish": {}}

def add(cat, key, title):
    OUT[cat].setdefault(key, []).append(title)

def solar_events(year=1404):
    url = f"https://calendar.farhang.gov.ir/export?year={year}"
    cal = Calendar(requests.get(url, timeout=30).text)
    for ev in cal.events:
        add("solar", ev.begin.format('jMM-jDD'), ev.name)

def islamic_events(year=1446):
    for m in range(1, 13):
        api = f"https://api.aladhan.com/v1/gToHCalendar/{year}-{m:02d}"
        for day in requests.get(api, timeout=30).json()["data"]:
            h = day["hijri"]
            add("islamic", f"{int(h['month']['number']):02d}-{int(h['day']):02d}", h["holidays"][0] if h["holidays"] else "")

def greg_events():
    csv = requests.get("https://www.un.org/en/observances/pdf/un-international-days.csv", timeout=30).text
    for line in csv.splitlines()[1:]:
        date_en, title = line.split(",", 1)
        dt = parser.parse(date_en.strip())
        add("gregorian", f"{dt.month:02d}-{dt.day:02d}", title.strip())

def zoro_events():
    html = requests.get("https://www.bonyadzartosht.ir/calendar", timeout=30).text
    soup = BeautifulSoup(html, "html.parser")
    for row in soup.select("table tr")[1:]:
        tds = [td.text.strip() for td in row.find_all("td")]
        if len(tds) >= 2:
            jd = tds[0]
            jmo, jd2 = int(jd[:2]), int(jd[2:])
            add("zoroastrian", f"{jmo:02d}-{jd2:02d}", tds[1])

def jewish_events(year=2025):
    for m in range(1, 13):
        api = f"https://www.hebcal.com/hebcal?cfg=json&v=1&year={year}&month={m}&maj=on&min=on&mod=on&nx=on&s=on"
        for it in requests.get(api, timeout=30).json()["items"]:
            if it["category"] == "holiday":
                dt = parser.isoparse(it["date"])
                add("jewish", f"{dt.month:02d}-{dt.day:02d}", it["title"])

def main():
    solar_events()
    islamic_events()
    greg_events()
    zoro_events()
    jewish_events()
    with open("events.json", "w", encoding="utf-8") as f:
        json.dump(OUT, f, ensure_ascii=False, indent=2)
    print("events.json ساخته شد.")

if __name__ == "__main__":
    main()
