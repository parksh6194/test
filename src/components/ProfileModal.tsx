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
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [birthTime, setBirthTime] = useState(profile.birthTime);
  const [isTimeUnknown, setIsTimeUnknown] = useState(profile.birthTime === "unknown" || !profile.birthTime);
  const [calendarType, setCalendarType] = useState<CalendarType>(profile.calendarType);
  const [gender, setGender] = useState<Gender>(profile.gender);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || "행운이",
      birthDate: birthDate || "1996-05-15",
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

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 mb-1.5">
              <Calendar className="inline w-3.5 h-3.5 mr-1 text-amber-400" />
              생년월일
            </label>
            <input
              id="profile-birthdate-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#161625] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 text-sm transition-all"
              required
            />
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
