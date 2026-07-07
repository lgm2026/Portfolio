import csv, json, re
placeholder=re.compile(r'^[A-Z]{2}-\d+$')
rows=[]
with open("airports_raw.csv", newline='', encoding='utf-8') as f:
    r=csv.reader(f); next(r)
    for row in r:
        if len(row)<16: continue
        typ=row[2]; country=row[8]
        keep=(typ in ("large_airport","medium_airport")) or (typ=="small_airport" and country=="US")
        if not keep: continue
        ident=row[1].strip(); iata=row[13].strip()
        gps=row[14].strip(); local=row[15].strip()
        code=ident
        if placeholder.match(ident):
            code = local if local else (gps if gps else "")
        def clean(s): return " ".join(s.replace("?","").replace(">","").replace("<","").split())
        name=clean(row[3]); city=clean(row[10])
        region=row[9].strip()
        if "-" in region: region=region.split("-",1)[1]
        tc={"large_airport":"L","medium_airport":"M","small_airport":"S"}[typ]
        try: elev=int(float(row[6])) if row[6].strip()!="" else ""
        except: elev=""
        rows.append([code,iata,name,city,region,country,tc,elev])
rows.sort(key=lambda x:(0 if x[5]=="US" else 1, x[5], x[2]))
out="var AIRPORTS_DB = "+json.dumps(rows, ensure_ascii=True, separators=(",",":"))+";"
open("airports_db.js","w").write(out)
print("entries:", len(rows), "bytes:", len(out))
nocode=sum(1 for x in rows if x[0]=="")
print("entries with no code:", nocode)
