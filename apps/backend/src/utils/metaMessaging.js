// Enviar DM por Instagram Messaging API (solo si el usuario abrió conversación o story-mention crea hilo)
// Regla de 24 horas: responde dentro de esa ventana. :contentReference[oaicite:3]{index=3}
export async function sendIgDM(pageAccessToken, recipientId, text) {
  const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`;
  const body = {
    recipient: { id: recipientId }, // Instagram Scoped ID que llega en el webhook de Messaging
    messaging_type: 'RESPONSE',
    message: { text }
  };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`IG DM failed: ${r.status} ${t}`);
  return JSON.parse(t);
}
