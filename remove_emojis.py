import os
import re

emoji_pattern = re.compile(
    '[\U0001F600-\U0001F64F'
    '\U0001F300-\U0001F5FF'
    '\U0001F680-\U0001F6FF'
    '\U0001F700-\U0001F77F'
    '\U0001F780-\U0001F7FF'
    '\U0001F800-\U0001F8FF'
    '\U0001F900-\U0001F9FF'
    '\U0001FA00-\U0001FA6F'
    '\U0001FA70-\U0001FAFF'
    '\U0001F1E6-\U0001F1FF'
    '\u2600-\u26FF'
    '\u2700-\u27BF'
    ']+', flags=re.UNICODE
)

target_dir = 'tutorment-project'

for root, dirs, files in os.walk(target_dir):
    if 'node_modules' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.css')):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()
                cleaned = emoji_pattern.sub('', content)
                cleaned = cleaned.replace('> Priyanshu', '>Priyanshu')
                cleaned = cleaned.replace('> Vipul', '>Vipul')
                cleaned = cleaned.replace('> Honest', '>Honest')
                cleaned = cleaned.replace('> Live', '>Live')
                cleaned = cleaned.replace('> Built', '>Built')
                cleaned = cleaned.replace('> Student', '>Student')
                cleaned = cleaned.replace('> Book', '>Book')
                cleaned = cleaned.replace('> United', '>United')
                cleaned = cleaned.replace('> Canada', '>Canada')
                cleaned = cleaned.replace('> Australia', '>Australia')
                cleaned = cleaned.replace('> Germany', '>Germany')
                cleaned = cleaned.replace('> Singapore', '>Singapore')
                cleaned = cleaned.replace('> Ireland', '>Ireland')
                cleaned = cleaned.replace('" Priyanshu', '"Priyanshu')
                cleaned = cleaned.replace('" Vipul', '"Vipul')
                cleaned = cleaned.replace('" Honest', '"Honest')
                cleaned = cleaned.replace('" Live', '"Live')
                cleaned = cleaned.replace('" Built', '"Built')
                cleaned = cleaned.replace('" Student', '"Student')
                cleaned = cleaned.replace('" Book', '"Book')
                cleaned = cleaned.replace('" United', '"United')

                if content != cleaned:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(cleaned)
                    print(f'Cleaned: {path}')
            except Exception as e:
                print(f'Error on {path}: {e}')

print("Done cleaning all emojis.")
