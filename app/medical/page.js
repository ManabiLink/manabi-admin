//カレンダー

"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import supabase from "@/lib/supabaseClient";

export default function MedRecordCalendar({ userId = "testUser" }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [medRecords, setMedRecords] = useState({});
  const [form, setForm] = useState({ medicine: "", dosage: "", memo: "" });

  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf("month").day();

  // ---- Supabase からデータ読み込み ----
  useEffect(() => {
    const loadMonth = async () => {
      const startDate = currentMonth.startOf("month").format("YYYY-MM-DD");
      const endDate = currentMonth.endOf("month").format("YYYY-MM-DD");

      const { data, error } = await supabase
        .from("medRecords")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate);

      const newRecords = {};
      if (error) {
        console.error("Supabase load error:", error);
      } else if (data) {
        data.forEach((row) => {
          newRecords[row.date] = {
            medicine: row.medicine,
            dosage: row.dosage,
            memo: row.memo,
          };
        });
      }

      setMedRecords(newRecords);
    };

    loadMonth();
  }, [currentMonth, userId]);

  const handleOpenModal = (date) => {
    setSelectedDate(date);
    const key = date.format("YYYY-MM-DD");
    setForm(
      medRecords[key] || { medicine: "", dosage: "", memo: "" }
    );
  };

  // ---- Supabase に保存（upsert） ----
  const handleSave = async () => {
    if (!selectedDate) return;
    const key = selectedDate.format("YYYY-MM-DD");

    const payload = {
      user_id: userId,
      date: key,
      medicine: form.medicine,
      dosage: form.dosage,
      memo: form.memo,
    };

    const { error } = await supabase
      .from("medRecords")
      .upsert(payload, { onConflict: ["user_id", "date"] });

    if (error) {
      console.error("Supabase save error:", error);
      return;
    }

    setMedRecords({
      ...medRecords,
      [key]: {
        medicine: form.medicine,
        dosage: form.dosage,
        memo: form.memo,
      },
    });

    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">
        お薬手帳（医療従事者）
      </h1>

      {/* 月ナビゲーション */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg border-2 border-gray-300">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-semibold"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          前の月
        </button>

        <h2 className="text-2xl font-bold text-black">
          {currentMonth.format("YYYY年 MM月")}
        </h2>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-semibold"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
        >
          次の月
        </button>
      </div>

      {/* カレンダー */}
      <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-300">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div
            key={d}
            className="text-center font-bold text-black text-lg py-2 border-b-2 border-gray-300"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = currentMonth.date(i + 1);
          const key = date.format("YYYY-MM-DD");
          const hasRecord = !!medRecords[key];

          return (
            <button
              key={i}
              onClick={() => handleOpenModal(date)}
              className={`border-2 p-3 rounded min-h-[100px] text-left transition-colors ${
                hasRecord
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300 hover:border-blue-400"
              }`}
            >
              <div className="font-bold text-black text-lg">
                {i + 1}
              </div>

              {hasRecord && (
                <>
                  <div className="text-sm text-black mt-2 font-semibold">
                    {medRecords[key].medicine}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {medRecords[key].dosage}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* モーダル */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-96 border-2 border-gray-400">
            <h3 className="text-xl font-bold mb-4 text-black">
              {selectedDate.format("YYYY年 MM月 DD日")} の記録
            </h3>

            <label className="block mt-4">
              <span className="font-semibold text-black block mb-2">
                薬名
              </span>
              <input
                type="text"
                value={form.medicine}
                onChange={(e) =>
                  setForm({ ...form, medicine: e.target.value })
                }
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder-gray-400"
                placeholder="薬の名前を入力"
              />
            </label>

            <label className="block mt-4">
              <span className="font-semibold text-black block mb-2">
                服用量
              </span>
              <input
                type="text"
                value={form.dosage}
                onChange={(e) =>
                  setForm({ ...form, dosage: e.target.value })
                }
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder-gray-400"
                placeholder="用量を入力"
              />
            </label>

            <label className="block mt-4">
              <span className="font-semibold text-black block mb-2">
                メモ
              </span>
              <textarea
                rows={3}
                value={form.memo}
                onChange={(e) =>
                  setForm({ ...form, memo: e.target.value })
                }
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder-gray-400"
                placeholder="メモを入力"
              ></textarea>
            </label>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-semibold"
              >
                キャンセル
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}