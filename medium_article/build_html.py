"""Builds article.html -- a browser-renderable version of article.md for a
clean one-paste into the Medium editor. It (1) swaps the two markdown tables
for the rendered table images, (2) rewrites image paths to absolute raw-GitHub
URLs so they transfer on paste, and (3) converts the markdown to HTML.

Run: pip install markdown && python build_html.py
"""
import os
import re
import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = ("https://raw.githubusercontent.com/NMemane1/"
       "CMPE258-Short-Story-TS-FM-DeepLearning/main/medium_article/images/")

with open(os.path.join(HERE, "article.md")) as f:
    lines = f.readlines()

# --- replace each contiguous block of markdown-table lines with an image -----
table_imgs = ["table1_models.png", "table2_results.png"]
out, i, t = [], 0, 0
while i < len(lines):
    if lines[i].lstrip().startswith("|"):
        while i < len(lines) and lines[i].lstrip().startswith("|"):
            i += 1
        img = table_imgs[t] if t < len(table_imgs) else table_imgs[-1]
        out.append(f"![Table](images/{img})\n")
        t += 1
    else:
        out.append(lines[i])
        i += 1
md_text = "".join(out)

# --- absolute image URLs so they survive the copy-paste into Medium ---------
md_text = md_text.replace("](images/", "](" + RAW)

html_body = markdown.markdown(md_text, extensions=["extra"])

page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>One Model to Forecast Them All</title>
<style>
  body {{ max-width: 720px; margin: 40px auto; padding: 0 20px;
         font-family: Georgia, serif; font-size: 19px; line-height: 1.7;
         color: #222; }}
  h1 {{ font-size: 34px; line-height: 1.25; }}
  h2 {{ font-size: 26px; margin-top: 2em; }}
  h3 {{ font-size: 20px; color: #555; font-weight: normal; }}
  img {{ max-width: 100%; height: auto; display: block; margin: 1.2em auto; }}
  em {{ color: #666; font-size: 16px; }}
  code {{ background:#f2f2f2; padding:1px 5px; border-radius:3px;
          font-size:15px; }}
  hr {{ border:none; border-top:1px solid #ddd; margin:2.2em 0; }}
  a {{ color:#1a8917; }}
</style></head><body>
{html_body}
</body></html>
"""

with open(os.path.join(HERE, "article.html"), "w") as f:
    f.write(page)
print("wrote article.html  (" + str(len(page)) + " bytes, "
      + str(t) + " tables swapped for images)")
