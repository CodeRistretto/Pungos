"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const TYPES = ["ig_story", "ig_post", "tiktok", "google_review", "checkin"];

export default function RulesClient({ defaultCampaign = "" }) {
  const [campaigns, setCampaigns] = useState([]);
  const [items, setItems] = useState([]);
  const [cid, setCid] = useState(defaultCampaign);
  const [form, setForm] = useState({
    actionType: "ig_story",
    criteria: { hashtag: "", mention: "", minStars: 5 },
    points: 20,
    perUserDailyCap: 2,
    globalCap: 100,
    couponTemplateId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCampaigns() {
    try {
      const r = await api("/api/campaigns");
      setCampaigns(r.data || r.campaigns || []);
    } catch {
      setCampaigns([
        { _id: "c1", name: "Septiembre IG Stories" },
        { _id: "c2", name: "Reviews Google" },
      ]);
    }
  }

  async function loadRules(campaignId) {
    if (!campaignId) {
      setItems([]);
      return;
    }
    try {
      const r = await api(`/api/rules?campaignId=${campaignId}`);
      setItems(r.data || r.rules || []);
    } catch {
      setItems([
        {
          _id: "r1",
          campaignId,
          actionType: "ig_story",
          criteria: { mention: "@pungos" },
          points: 20,
          perUserDailyCap: 2,
          globalCap: 100,
        },
      ]);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);
  useEffect(() => {
    loadRules(cid);
  }, [cid]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/rules", { method: "POST", body: { ...form, campaignId: cid } });
      await loadRules(cid);
      setForm({
        actionType: "ig_story",
        criteria: { hashtag: "", mention: "", minStars: 5 },
        points: 20,
        perUserDailyCap: 2,
        globalCap: 100,
        couponTemplateId: "",
      });
    } catch (err) {
      setError(err?.message || "Error al crear la regla");
    }
    setLoading(false);
  };

  return (
    <main className="section section-py">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reglas</h1>
        <Link href="/campaigns" className="px-3 py-2 rounded-lg border">
          ← Campañas
        </Link>
      </div>

      {/* Selector campaña */}
      <div className="card mb-6">
        <p className="font-semibold mb-2">Selecciona campaña</p>
        <select
          className="border rounded-lg px-3 py-2"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
        >
          <option value="">— elige —</option>
          {campaigns.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form nueva regla */}
      {cid && (
        <div className="card mb-6">
          <p className="font-semibold mb-3">Nueva regla</p>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-6 gap-3 items-start">
            <select
              className="border rounded-lg px-3 py-2 col-span-2"
              value={form.actionType}
              onChange={(e) => setForm({ ...form, actionType: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="#hashtag"
              value={form.criteria.hashtag}
              onChange={(e) =>
                setForm({ ...form, criteria: { ...form.criteria, hashtag: e.target.value } })
              }
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="@mención"
              value={form.criteria.mention}
              onChange={(e) =>
                setForm({ ...form, criteria: { ...form.criteria, mention: e.target.value } })
              }
            />
            <input
              type="number"
              min="1"
              max="5"
              className="border rounded-lg px-3 py-2"
              placeholder="min stars"
              value={form.criteria.minStars}
              onChange={(e) =>
                setForm({ ...form, criteria: { ...form.criteria, minStars: Number(e.target.value) } })
              }
            />
            <input
              type="number"
              className="border rounded-lg px-3 py-2"
              placeholder="puntos"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
            />
            <input
              type="number"
              className="border rounded-lg px-3 py-2"
              placeholder="cap por día"
              value={form.perUserDailyCap}
              onChange={(e) =>
                setForm({ ...form, perUserDailyCap: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="border rounded-lg px-3 py-2"
              placeholder="cap global"
              value={form.globalCap}
              onChange={(e) => setForm({ ...form, globalCap: Number(e.target.value) })}
            />
            <input
              className="border rounded-lg px-3 py-2 col-span-2"
              placeholder="couponTemplateId (opcional)"
              value={form.couponTemplateId}
              onChange={(e) => setForm({ ...form, couponTemplateId: e.target.value })}
            />
            <button disabled={loading} className="px-3 py-2 rounded-lg bg-pungos-primary text-white col-span-2">
              {loading ? "Creando..." : "Crear regla"}
            </button>
          </form>
          {error && <p className="text-rose-600 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Listado */}
      <div className="card">
        <p className="font-semibold mb-3">Reglas de la campaña</p>
        <div className="overflow-auto border rounded-xl bg-white">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Criterios</th>
                <th className="px-4 py-3 text-left">Puntos</th>
                <th className="px-4 py-3 text-left">Cap/día</th>
                <th className="px-4 py-3 text-left">Cap global</th>
                <th className="px-4 py-3 text-left">Cupón</th>
              </tr>
            </thead>
            <tbody className="[&_tr:hover]:bg-slate-50">
              {items.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-3">{r.actionType}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.criteria?.hashtag && <>#{r.criteria.hashtag} </>}
                    {r.criteria?.mention && <>@{r.criteria.mention} </>}
                    {typeof r.criteria?.minStars === "number" && <>★ {r.criteria.minStars}+ </>}
                  </td>
                  <td className="px-4 py-3">{r.points}</td>
                  <td className="px-4 py-3">{r.perUserDailyCap}</td>
                  <td className="px-4 py-3">{r.globalCap}</td>
                  <td className="px-4 py-3">{r.couponTemplateId || "—"}</td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Sin reglas para esta campaña.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
