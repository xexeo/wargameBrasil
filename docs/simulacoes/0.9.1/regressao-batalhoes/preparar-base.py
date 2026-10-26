import subprocess,tarfile,io,json
from pathlib import Path
p=Path('/tmp/company-regression');p.mkdir(exist_ok=True)
data=subprocess.check_output(['git','archive','--format=tar','894853c','dist'])
with tarfile.open(fileobj=io.BytesIO(data)) as tar:tar.extractall(p,filter='data')
(p/'package.json').write_text('{"type":"module"}')
