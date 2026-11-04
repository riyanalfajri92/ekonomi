"""Read BI official XLS from stdin; formulas/macros are never executed."""
import sys,json,math,io
import xlrd
raw=sys.stdin.buffer.read(8_000_001)
if len(raw)>8_000_000: raise ValueError('Workbook exceeds 8 MB')
b=xlrd.open_workbook(file_contents=raw,on_demand=True)
out=[]
for s in b.sheets():
 if s.nrows>600 or s.ncols>800: raise ValueError('Unexpected workbook dimensions')
 rows=[]
 for r in range(s.nrows):
  row=[]
  for c in range(s.ncols):
   x=s.cell(r,c);v=x.value
   if x.ctype==xlrd.XL_CELL_DATE:
    try:v=xlrd.xldate_as_datetime(v,b.datemode).strftime('%Y-%m')
    except (ValueError,OverflowError):v=None
   if isinstance(v,float) and not math.isfinite(v):v=None
   row.append(v)
  rows.append(row)
 out.append({'name':s.name,'rows':rows})
json.dump(out,sys.stdout,allow_nan=False,ensure_ascii=False)
