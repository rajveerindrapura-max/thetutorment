with open('tutorment-project/frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = "📧 support@thetutorment.com\\n📱 +91 90570 54077 (WhatsApp)\\n📍 3, Waterloo Road, Upton Park, London E6 1AP\\n\\n🌐 Instagram: @thetutorment\\n🌐 LinkedIn: /company/thetutorment"
replacement = "Email: support@thetutorment.com\\nPhone: +91 90570 54077 (WhatsApp)\\nAddress: 3, Waterloo Road, Upton Park, London E6 1AP\\n\\nInstagram: @thetutorment\\nLinkedIn: /company/thetutorment"

if target in content:
    content = content.replace(target, replacement)
    with open('tutorment-project/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced contact emojis in index.html")
else:
    print("Target not found directly, regex cleaning...")
    import re
    # Remove emoji characters from index.html contact section
    content = re.sub(r'[📧📱📍🌐]', '', content)
    with open('tutorment-project/frontend/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cleaned via regex")
