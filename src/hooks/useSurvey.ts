import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SurveyEntry } from '../types/survey';

export const useSurvey = () => {
    const [data, setData] = useState<SurveyEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: entries, error } = await supabase
                .from('sebaetdon_surveys')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setData(entries || []);
        } catch (error) {
            console.error('Error fetching survey data:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitSurvey = async (entry: SurveyEntry) => {
        try {
            const { error } = await supabase
                .from('sebaetdon_surveys')
                .insert([entry]);

            if (error) throw error;
            await fetchData();
            return true;
        } catch (error) {
            console.error('Error submitting survey:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, submitSurvey, refresh: fetchData };
};
