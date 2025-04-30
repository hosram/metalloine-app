# build_grades_split.py
import pandas as pd, pathlib

SOURCES = {
    "steel"      : "https://raw.githubusercontent.com/datasets/steel-grades/main/steel_grades.csv",
    "cast_iron"  : "https://raw.githubusercontent.com/datasets/cast-iron-grades/main/ci_grades.csv",
    "aluminium"  : "https://raw.githubusercontent.com/datasets/aluminium-grades/main/al_grades.csv",
    "copper"     : "https://raw.githubusercontent.com/datasets/copper-grades/main/cu_grades.csv",
    "brass"      : "https://raw.githubusercontent.com/datasets/brass-grades/main/brass_grades.csv",
    "phosphor_bronze": "https://raw.githubusercontent.com/datasets/bronze-grades/main/pb_grades.csv"
}

for mat, url in SOURCES.items():
    df = pd.read_csv(url)
    df.to_json(f"{mat}.json", orient="records", force_ascii=False)
    print(mat, len(df), "rows →", f"{mat}.json")
