import React, { useState } from "react";
import { X, Check, Calendar, Clock, User, Sparkles } from "lucide-react";
import { CalendarType, Gender, UserProfile } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);

  // Parse initial birth date parts (YYYY-MM-DD)
  const initialDateParts = (profile.birthDate || "1996-05-15").split("-");
  const [birthYear, setBirthYear] = useState(initialDateParts[0] || "1996");
  const [birthMonth, setBirthMonth] = useState(initialDateParts[1] || "05");
  const [birthDay, setBirthDay] = useState(initialDateParts[2] || "15");

  const [birthTime, setBirthTime] = useState(profile.birthTime);
  const [isTimeUnknown, setIsTimeUnknown] = useState(profile.birthTime === "unknown" || !profile.birthTime);
  const [calendarType, setCalendarType] = useState<CalendarType>(profile.calendarType);
  const [gender, setGender] = useState<Gender>(profile.gender);

  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const monthInputRef = React.useRef<HTMLInputElement>(null);
  const dayInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format normalized YYYY-MM-DD
    const rawY = parseInt(birthYear, 10);
    const validYear = isNaN(rawY) || rawY < 1900 ? "1996" : String(rawY).padStart(4, "0");

    const rawM = parseInt(birthMonth, 10);
    const validMonth = isNaN(rawM) ? "01" : String(Math.min(12, Math.max(1, rawM))).padStart(2, "0");

    const rawD = parseInt(birthDay, 10);
    const validDay = isNaN(rawD) ? "01" : String(Math.min(31, Math.max(1, rawD))).padStart(2, "0");

    const formattedBirthDate = `${validYear}-${validMonth}-${validDay}`;

    onSave({
      name: name.trim() || "행운이",
      birthDate: formattedBirthDate,
      birthTime: isTimeUnknown ? "unknown" : birthTime || "12:00",
      calendarType,
      gender,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0f0f1a] border border-white/5 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0f0f1a]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-[#161625] border border-amber-500/30 text-amber-300 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-kr text-base font-bold text-amber-100">내 사주 정보 설정</h2>
              <p className="text-xs text-slate-400">정밀한 맞춤 운세 산출을 위한 기본 정보입니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-full hover:bg-[#161625] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-sm bg-[#050508]/40">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">이름 (또는 닉네임)</label>
            <div className="relative">
              <input
                id="profile-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                maxLength={10}
                className="w-full bg-[#161625] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">성별</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="gender-female-btn"
                onClick={() => setGender("female")}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  gender === "female"
                    ? "bg-gradient-to-b from-amber-500/20 to-[#161625] border-amber-400/80 text-amber-200 shadow-md shadow-amber-500/10"
                    : "bg-[#161625] border-white/5 text-slate-400 hover:bg-[#1c1c30]"
                }`}
              >
                여성 👩
              </button>
              <button
                type="button"
                id="gender-male-btn"
                onClick={() => setGender("male")}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  gender === "male"
                    ? "bg-gradient-to-b from-amber-500/20 to-[#161625] border-amber-400/80 text-amber-200 shadow-md shadow-amber-500/10"
                    : "bg-[#161625] border-white/5 text-slate-400 hover:bg-[#1c1c30]"
                }`}
              >
                남성 👨
              </button>
            </div>
          </div>

          {/* Calendar Type */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">양력 / 음력 구분</label>
            <div className="grid grid-cols-3 gap-2">
              {(["solar", "lunar", "leap-lunar"] as CalendarType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCalendarType(type)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    calendarType === type
                      ? "bg-gradient-to-b from-amber-500/20 to-[#161625] border-amber-400/80 text-amber-200 shadow-sm"
                      : "bg-[#161625] border-white/5 text-slate-400 hover:bg-[#1c1c30]"
                  }`}
                >
                  {type === "solar" ? "양력 ☀️" : type === "lunar" ? "음력 (평달) 🌙" : "음력 (윤달) 🌓"}
                </button>
              ))}
            </div>
          </div>

          {/* Birth Date (Direct Year / Month / Day Input) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-amber-200/90 flex items-center">
                <Calendar className="inline w-3.5 h-3.5 mr-1 text-amber-400" />
                생년월일 (직접 입력)
              </label>
              <span className="text-[11px] text-slate-400">숫자로 직접 입력 (예: 1996 5 15)</span>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Year */}
              <div className="col-span-5 relative flex items-center">
                <input
                  ref={yearInputRef}
                  id="profile-birthdate-input"
                  name="birthYear"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={birthYear}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                    setBirthYear(val);
                    if (val.length === 4) {
                      monthInputRef.current?.focus();
                    }
                  }}
                  placeholder="1996"
                  maxLength={4}
                  className="w-full bg-[#161625] border border-white/10 rounded-xl px-3 py-2.5 text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm font-medium pr-7 transition-all"
                  required
                />
                <span className="absolute right-2.5 text-xs text-slate-400 pointer-events-none font-medium">년</span>
              </div>

              {/* Month */}
              <div className="col-span-3 relative flex items-center">
                <input
                  ref={monthInputRef}
                  id="profile-birth-month"
                  name="birthMonth"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={birthMonth}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                    setBirthMonth(val);
                    if (val.length === 2 || (val.length === 1 && parseInt(val, 10) >= 2)) {
                      dayInputRef.current?.focus();
                    }
                  }}
                  placeholder="05"
                  maxLength={2}
                  className="w-full bg-[#161625] border border-white/10 rounded-xl px-2 py-2.5 text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm font-medium pr-6 transition-all"
                  required
                />
                <span className="absolute right-2 text-xs text-slate-400 pointer-events-none font-medium">월</span>
              </div>

              {/* Day */}
              <div className="col-span-4 relative flex items-center">
                <input
                  ref={dayInputRef}
                  id="profile-birth-day"
                  name="birthDay"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={birthDay}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                    setBirthDay(val);
                  }}
                  placeholder="15"
                  maxLength={2}
                  className="w-full bg-[#161625] border border-white/10 rounded-xl px-2.5 py-2.5 text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm font-medium pr-6 transition-all"
                  required
                />
                <span className="absolute right-2 text-xs text-slate-400 pointer-events-none font-medium">일</span>
              </div>
            </div>
          </div>

          {/* Birth Time */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-amber-200/90 flex items-center">
                <Clock className="inline w-3.5 h-3.5 mr-1 text-amber-400" />
                태어난 시간
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-400 hover:text-amber-200">
                <input
                  type="checkbox"
                  checked={isTimeUnknown}
                  onChange={(e) => setIsTimeUnknown(e.target.checked)}
                  className="rounded border-slate-700 bg-[#161625] text-amber-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>시간 모름</span>
              </label>
            </div>
            {!isTimeUnknown && (
              <input
                id="profile-birthtime-input"
                type="time"
                value={birthTime === "unknown" ? "12:00" : birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-[#161625] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm transition-all"
              />
            )}
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              id="profile-save-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>사주 정보 저장 & 운세 확인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
