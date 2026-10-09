import qrcode
import base64
from io import BytesIO


def generate_ticket_qr(ticket_token: str) -> str:
 
    qr = qrcode.QRCode(
        version=None,  # auto size
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )

    qr.add_data(ticket_token)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")

    return base64.b64encode(buffer.getvalue()).decode("utf-8")
