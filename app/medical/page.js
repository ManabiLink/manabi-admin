// カレンダー
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import supabase from "@/lib/supabaseClient";

const JAPAN_HOLIDAYS = [
  "2025-01-01",
  "2025-01-13",
  "2025-02-11",
  "2025-02-23",
  "2025-03-20",
  "2025-04-29",
  "2025-05-03",
  "2025-05-04",
  "2025-05-05",
  "2025-07-21",
  "2025-08-11",
  "2025-09-15",
  "2025-09-23",
  "2025-10-13",
  "2025-11-03",
  "2025-11-23",
];

export default function MedRecordCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [medRecords, setMedRecords] = useState({});
  const [form, setForm] = useState({ medicine: "", dosage: "", memo: "" });
  const [userId, setUserId] = useState(null);

  const router = useRouter();

  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf("month").day();

  // ---- ログインユーザー取得 ----
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
    };

    getUser();
  }, [router]);

  // ---- Supabase からデータ読み込み ----
  useEffect(() => {
    if (!userId) return;

    const loadMonth = async () => {
      const startDate = currentMonth.startOf("month").format("YYYY-MM-DD");
      const endDate = currentMonth.endOf("month").format("YYYY-MM-DD");

      const { data, error } = await supabase
        .from("medRecords_calendar")
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
    setForm(medRecords[key] || { medicine: "", dosage: "", memo: "" });
  };

  // ---- Supabase に保存（upsert） ----
  const handleSave = async () => {
    if (!selectedDate || !userId) return;

    const key = selectedDate.format("YYYY-MM-DD");

    const payload = {
      user_id: userId,
      date: key,
      medicine: form.medicine,
      dosage: form.dosage,
      memo: form.memo,
    };

    const { error } = await supabase
      .from("medRecords_calendar")
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

  const getDateColor = (date) => {
    const day = date.day();
    const key = date.format("YYYY-MM-DD");

    if (JAPAN_HOLIDAYS.includes(key) || day === 0) return "text-red-600";
    if (day === 6) return "text-blue-600";
    return "text-black";
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
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            className={`text-center font-bold text-lg py-2 border-b-2 border-gray-300 ${
              i === 0
                ? "text-red-600"
                : i === 6
                ? "text-blue-600"
                : "text-black"
            }`}
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
              <div className="flex min-h-[80px]">
                {/* 日付（左・縦中央固定） */}
                <div
                  className={`w-10 flex items-center justify-center font-bold ${getDateColor(
                    date
                  )}`}
                >
                  {i + 1}
                </div>

                {/* 縦線 */}
                <div className="border-l mx-2"></div>

                {/* 内容 */}
                <div className="flex-1">
                  {hasRecord && (
                    <>
                      <div className="text-sm text-black font-semibold">
                        {medRecords[key].medicine}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {medRecords[key].dosage}
                      </div>
                      <div className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">
                        {medRecords[key].memo}
                      </div>
                    </>
                  )}
                </div>
              </div>
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
                placeholder="薬の名前を入力"
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder:text-gray-400"
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
                placeholder="用量を入力"
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder:text-gray-400"
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
                placeholder="メモを入力"
                className="w-full p-2 border-2 border-gray-300 rounded text-black placeholder:text-gray-400"
              ></textarea>
            </label>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 font-semibold"
              >
                キャンセル
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
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
