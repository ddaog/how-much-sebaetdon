import React, { useState } from 'react';
import type { Relationship, GiverCareer, MaritalStatus, ReceiverStatus, AgeGroup, SurveyEntry } from '../types/survey';
import { Send } from 'lucide-react';

interface SurveyFormProps {
    onSubmit: (data: SurveyEntry) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit }) => {
    // Giver Info
    const [giverCareer, setGiverCareer] = useState<GiverCareer>('worker');
    const [giverMarital, setGiverMarital] = useState<MaritalStatus>('single');
    const [giverAgeGroup, setGiverAgeGroup] = useState<AgeGroup>('30s');

    // Receiver Info
    const [relationship, setRelationship] = useState<Relationship>('nephew_niece');
    const [receiverStatus, setReceiverStatus] = useState<ReceiverStatus>('elementary');
    const [receiverAgeGroup, setReceiverAgeGroup] = useState<AgeGroup>('10s');

    // Gift Info
    const [amount, setAmount] = useState<number>(50000);
    const [isPlanned, setIsPlanned] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            giver_career: giverCareer,
            giver_marital: giverMarital,
            giver_age_group: giverAgeGroup,
            relationship,
            receiver_status: receiverStatus,
            receiver_age_group: receiverAgeGroup,
            amount: Number(amount),
            is_planned: isPlanned,
        });
    };

    const amountPresets = [10000, 30000, 50000, 100000, 200000, 300000];

    return (
        <div className="w-full max-w-md mx-auto space-y-6 pb-20 pt-10 px-4">
            <header className="px-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">세뱃돈 보따리 🧧</h1>
                <p className="text-gray-500 font-medium">다른 사람들은 얼마를 주는지 알아볼까요?</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Giver Information */}
                <div className="toss-card space-y-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-6 bg-[#3182f6] rounded-full"></div>
                        <h3 className="text-xl font-bold">주는 사람 정보</h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">나의 연령대</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['20s', '30s', '40_plus'] as AgeGroup[]).map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setGiverAgeGroup(val)}
                                    className={`py-3 rounded-xl text-[15px] font-bold transition-all ${giverAgeGroup === val ? 'bg-[#3182f6] text-white' : 'bg-[#f2f4f6] text-[#4e5968] active:bg-[#e5e8eb]'}`}
                                >
                                    {val === '40_plus' ? '40대+' : val.replace('s', '대')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">나의 직업</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'worker', label: '직장인' },
                                { id: 'entrepreneur', label: '사업/자영업' },
                                { id: 'student', label: '학생' },
                                { id: 'unemployed', label: '취준/휴직' },
                                { id: 'etc', label: '기타' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setGiverCareer(item.id as GiverCareer)}
                                    className={`py-2 px-4 rounded-full text-[14px] font-bold transition-all border ${giverCareer === item.id ? 'bg-[#3182f6] text-white border-transparent' : 'bg-white text-[#4e5968] border-[#e5e8eb] active:bg-[#f2f4f6]'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">결혼 여부</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'single', label: '미혼/비혼' },
                                { id: 'married', label: '기혼' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setGiverMarital(item.id as MaritalStatus)}
                                    className={`py-3 rounded-xl text-[15px] font-bold transition-all ${giverMarital === item.id ? 'bg-[#3182f6] text-white' : 'bg-[#f2f4f6] text-[#4e5968] active:bg-[#e5e8eb]'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Receiver Information */}
                <div className="toss-card space-y-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-6 bg-[#00d084] rounded-full"></div>
                        <h3 className="text-xl font-bold">받는 사람 정보</h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">관계</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'grandchild', label: '손주/자녀' },
                                { id: 'nephew_niece', label: '조카' },
                                { id: 'child_friend', label: '친구 자녀' },
                                { id: 'sibling', label: '형제/자매' },
                                { id: 'other', label: '기타' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setRelationship(item.id as Relationship)}
                                    className={`py-4 px-4 rounded-2xl text-[15px] font-bold transition-all border ${relationship === item.id ? 'bg-[#00d084] text-white border-transparent' : 'bg-[#f9fafb] text-[#4e5968] border-[#f2f4f6] active:bg-[#e5e8eb]'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">상태</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'preschooler', label: '미취학' },
                                { id: 'elementary', label: '초등생' },
                                { id: 'middle_high', label: '중고등' },
                                { id: 'university', label: '대학생' },
                                { id: 'worker', label: '직장인' },
                                { id: 'etc', label: '기타' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setReceiverStatus(item.id as ReceiverStatus)}
                                    className={`py-3 rounded-xl text-[14px] font-bold transition-all ${receiverStatus === item.id ? 'bg-[#00d084] text-white' : 'bg-[#f2f4f6] text-[#4e5968] active:bg-[#e5e8eb]'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-400">받는 사람 연령대</label>
                        <div className="flex flex-wrap gap-2">
                            {(['under_10', '10s', '20s'] as AgeGroup[]).map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setReceiverAgeGroup(val)}
                                    className={`py-2 px-4 rounded-full text-[14px] font-bold transition-all border ${receiverAgeGroup === val ? 'bg-[#00d084] text-white border-transparent' : 'bg-white text-[#4e5968] border-[#e5e8eb] active:bg-[#f2f4f6]'}`}
                                >
                                    {val === 'under_10' ? '10세 미만' : val.replace('s', '대')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: Amount */}
                <div className="toss-card space-y-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-6 bg-[#ffbb00] rounded-full"></div>
                        <h3 className="text-xl font-bold">얼마나 줄까요?</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {amountPresets.map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setAmount(val)}
                                className={`py-4 rounded-xl text-[16px] font-bold transition-all border ${amount === val ? 'bg-[#ffbb00] text-white border-transparent shadow-md' : 'bg-white text-[#333d4b] border-[#e5e8eb] active:bg-[#f2f4f6]'}`}
                            >
                                {(val / 10000).toLocaleString()}만
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full p-5 bg-[#f2f4f6] rounded-2xl text-2xl font-bold text-[#191f28] border-none focus:ring-2 focus:ring-[#ffbb00] transition-all"
                            placeholder="금액 직접 입력"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold text-[#8b95a1]">원</span>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-[#f9fafb] rounded-2xl">
                        <input
                            type="checkbox"
                            id="isPlanned"
                            checked={isPlanned}
                            onChange={(e) => setIsPlanned(e.target.checked)}
                            className="w-6 h-6 rounded-lg border-[#d1d6db] text-[#3182f6] focus:ring-[#3182f6]"
                        />
                        <label htmlFor="isPlanned" className="text-[15px] font-medium text-[#4e5968] cursor-pointer">
                            아직 안 줬지만 줄 계획이에요
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-5 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center space-x-3 transition-all transform active:scale-[0.97]"
                    >
                        <span>시세 분석 결과 보기</span>
                        <Send size={24} />
                    </button>
                </div>
            </form>
        </div>
    );
};
