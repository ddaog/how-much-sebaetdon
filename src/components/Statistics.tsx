import React from 'react';
import type { SurveyEntry } from '../types/survey';
import { TrendingUp, Users, Info, Send } from 'lucide-react';

interface StatisticsProps {
    data: SurveyEntry[];
    currentSurvey?: SurveyEntry;
}

import { useState } from 'react';
import { share, getTossShareLink } from '@apps-in-toss/web-framework';

export const Statistics: React.FC<StatisticsProps> = ({ data, currentSurvey }) => {
    const [filterMode, setFilterMode] = useState<'global' | 'giver' | 'receiver'>('giver');

    const handleShare = async () => {
        try {
            const amount = activeStats.mostFrequent / 10000;
            const title = filterMode === 'giver' ? '내 조건 맞춤' : filterMode === 'receiver' ? '받는 분 조건' : '전체 시세';
            const message = `🧧 세뱃돈 시세 분석 결과\n\n${title} 가장 많이 나온 금액은 ${amount}만원입니다.\n다른 사람들은 얼마를 주는지 확인해보세요!`;

            const shareLink = await getTossShareLink('intoss://sebaetdon-survey');
            await share({ message: `${message}\n\n${shareLink}` });
        } catch (error) {
            console.error('Sharing failed:', error);
            // Fallback for web browser if bridge fails
            if (navigator.share) {
                navigator.share({
                    title: '세뱃돈 메이커',
                    text: '다른 사람들은 세뱃돈 얼마를 주는지 확인해보세요!',
                    url: window.location.href
                }).catch(() => { });
            } else {
                alert('공유하기는 토스 앱이나 모바일 환경에서 가능합니다.');
            }
        }
    };

    // Helper to calculate statistics
    const calculateStats = (entries: SurveyEntry[]) => {
        if (entries.length === 0) return { total: 0, average: 0, mostFrequent: 0 };

        const validAmounts = entries.map(d => Number(d.amount)).filter(n => !isNaN(n));
        const total = validAmounts.length;
        const average = Math.round(validAmounts.reduce((a, b) => a + b, 0) / total);

        const grouped: Record<number, number> = {};
        validAmounts.forEach(val => {
            grouped[val] = (grouped[val] || 0) + 1;
        });
        const mostFrequent = Number(Object.entries(grouped).sort((a, b) => b[1] - a[1])[0][0]);

        return { total, average, mostFrequent };
    };

    const globalStats = calculateStats(data);

    // Filtered data for "people like me" (Giver)
    const giverMatchedData = currentSurvey ? data.filter(d =>
        (d as any).giver_career === (currentSurvey as any).giver_career &&
        (d as any).giver_marital === (currentSurvey as any).giver_marital &&
        d.giver_age_group === currentSurvey.giver_age_group
    ) : [];

    // Filtered data for "people like receiver"
    const receiverMatchedData = currentSurvey ? data.filter(d =>
        d.relationship === currentSurvey.relationship &&
        (d as any).receiver_status === (currentSurvey as any).receiver_status &&
        d.receiver_age_group === currentSurvey.receiver_age_group
    ) : [];

    const giverStats = calculateStats(giverMatchedData);
    const receiverStats = calculateStats(receiverMatchedData);

    const activeStats = filterMode === 'giver' ? giverStats : filterMode === 'receiver' ? receiverStats : globalStats;

    const getGiverTags = () => {
        if (!currentSurvey) return [];
        const ageLabel = currentSurvey.giver_age_group === '40_plus' ? '40대+' : currentSurvey.giver_age_group.replace('s', '대');
        const careerMap: Record<string, string> = {
            'worker': '직장인',
            'business': '사업/자영업',
            'student': '학생',
            'job_seeker': '취준/휴직',
            'etc': '기타'
        };
        const maritalLabel = (currentSurvey as any).giver_marital === 'married' ? '기혼' : '미혼/비혼';
        return [ageLabel, careerMap[(currentSurvey as any).giver_career] || '기타', maritalLabel];
    };

    const getReceiverTags = () => {
        if (!currentSurvey) return [];
        const relationMap: Record<string, string> = {
            'niece_nephew': '조카',
            'sibling': '형제/자매',
            'cousin': '사촌',
            'friend_child': '지인 자녀',
            'etc': '기타'
        };
        const statusMap: Record<string, string> = {
            'preschooler': '미취학',
            'elementary': '초등학생',
            'middle_high': '중/고등생',
            'university': '대학생',
            'worker': '직장인/성인'
        };
        return [relationMap[currentSurvey.relationship] || '기타', statusMap[(currentSurvey as any).receiver_status] || '기타'];
    };

    const activeTags = filterMode === 'giver' ? getGiverTags() : filterMode === 'receiver' ? getReceiverTags() : ['전체 사용자'];

    const StatCard = ({ title, stats, colorHex }: { title: string, stats: any, colorHex: string }) => (
        <div className="toss-card overflow-hidden bg-white border border-[#f2f4f6]">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-400 mb-2">{title}</span>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {activeTags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 bg-[#f2f4f6] text-[#4e5968] text-[12px] font-bold rounded-lg"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-[#191f28]">가장 많이 나온 금액</h3>
                </div>
                <div className={`p-2 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${colorHex}1a`, color: colorHex }}>
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="flex items-baseline space-x-1 mb-8">
                <span className="text-5xl font-black text-[#191f28]">
                    {(stats.mostFrequent / 10000).toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-[#333d4b]">만원</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#f2f4f6]">
                <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tight">참여 규모</div>
                    <div className="text-[17px] font-bold text-[#333d4b] flex items-center">
                        <Users size={16} className="mr-1.5 text-gray-400" />
                        {stats.total.toLocaleString()}명
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tight">평균 시세</div>
                    <div className="text-[17px] font-bold text-[#3182f6]">
                        {(stats.average / 10000).toFixed(1)}만원
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-md mx-auto space-y-8 pb-20 pt-10 px-4">
            <header className="px-2">
                <h1 className="text-3xl font-bold tracking-tight mb-2">분석 리포트 📊</h1>
                <p className="text-gray-500 font-medium">실시간 데이터를 기반으로 분석했어요</p>
            </header>

            {/* Mode Switcher - Toss Segmented Control Style */}
            <div className="flex p-1 bg-[#f2f4f6] rounded-2xl mx-1">
                {[
                    { id: 'giver', label: '나와 비슷' },
                    { id: 'receiver', label: '대상 비슷' },
                    { id: 'global', label: '전체' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterMode(tab.id as any)}
                        className={`flex-1 py-3 rounded-[14px] text-[15px] font-bold transition-all duration-200 ${filterMode === tab.id ? 'bg-white text-[#3182f6] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-[#6b7684] hover:text-[#4e5968]'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                <StatCard
                    title={filterMode === 'giver' ? '내 조건 맞춤' : filterMode === 'receiver' ? '받는 분 조건' : '전체 시세'}
                    stats={activeStats}
                    colorHex={filterMode === 'giver' ? '#3182f6' : filterMode === 'receiver' ? '#00d084' : '#333d4b'}
                />

                {filterMode !== 'global' && activeStats.total > 0 && (
                    <div className="toss-card bg-[#f9fafb] border-none">
                        <h4 className="font-bold text-[#191f28] mb-5 flex items-center text-lg">
                            <Info size={20} className="text-[#3182f6] mr-2" />
                            심층 분석 리포트
                        </h4>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-[#6b7684] font-medium">참여자 대비 비율</span>
                                <span className="font-bold text-[#191f28] text-lg bg-white px-3 py-1 rounded-xl shadow-sm">
                                    {globalStats.total > 0 ? ((activeStats.total / globalStats.total) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#6b7684] font-medium">전체 평균 대비</span>
                                <div className={`flex items-center font-bold text-lg ${activeStats.average >= globalStats.average ? 'text-[#f04452]' : 'text-[#3182f6]'}`}>
                                    <span className="bg-white px-3 py-1 rounded-xl shadow-sm">
                                        {activeStats.average >= globalStats.average ? '+' : ''}
                                        {((activeStats.average - globalStats.average) / 10000).toFixed(1)}만원
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-1 pt-4">
                <button
                    onClick={handleShare}
                    className="w-full py-5 bg-[#3182f6] text-white rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-[0.97] flex items-center justify-center space-x-3"
                >
                    <span>결과 공유하고 의견 묻기</span>
                    <Send size={24} />
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 mt-3 bg-white text-[#6b7684] rounded-2xl font-bold text-[16px] transition-all active:bg-gray-50"
                >
                    다시 입력하기
                </button>
            </div>
        </div>
    );
};
