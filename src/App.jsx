// src/App.jsx (기능을 설명하기 위한 간략한 예시 코드)
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // 간단한 스타일링을 위해 CSS 파일 import

// 백엔드 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  
  // 플레이스 분석 state
  const [placeUrl, setPlaceUrl] = useState('');
  
  // 키워드 순위 state
  const [businessName, setBusinessName] = useState('');
  const [keywords, setKeywords] = useState('');

  // 공통 state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/analyze-place`, { url: placeUrl });
      setResult(response.data.data); // 백엔드에서 받은 결과 저장
    } catch (err) {
      setError('분석 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckRankings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    const keywordList = keywords.split(',').map(k => k.trim()); // 쉼표로 구분된 키워드를 배열로
    try {
      const response = await axios.post(`${API_URL}/check-rankings`, {
        business_name: businessName,
        keywords: keywordList,
      });
      setResult(response.data.data);
    } catch (err) {
      setError('순위 확인 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>미래엔영어 네이버플레이스 점검 도구</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('analyze')} className={activeTab === 'analyze' ? 'active' : ''}>플레이스 분석</button>
        <button onClick={() => setActiveTab('rank')} className={activeTab === 'rank' ? 'active' : ''}>키워드 순위 확인</button>
      </div>

      {activeTab === 'analyze' && (
        <form onSubmit={handleAnalyze}>
          <h3>분석할 네이버 플레이스 URL 입력</h3>
          <input type="url" value={placeUrl} onChange={(e) => setPlaceUrl(e.target.value)} placeholder="https://map.naver.com/p/..." required />
          <button type="submit" disabled={loading}>{loading ? '분석 중...' : '분석 시작'}</button>
        </form>
      )}

      {activeTab === 'rank' && (
        <form onSubmit={handleCheckRankings}>
          <h3>우리 학원명</h3>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="정확한 상호명을 입력하세요" required />
          <h3>확인할 키워드 목록</h3>
          <textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="쉼표(,)로 구분하여 키워드를 입력하세요" required />
          <button type="submit" disabled={loading}>{loading ? '순위 확인 중...' : '순위 확인 시작'}</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">데이터를 가져오는 중입니다... 잠시만 기다려주세요.</div>}
      
      {result && (
        <div className="results">
          <h2>분석 결과</h2>
          {/* 결과를 예쁘게 표시하는 컴포넌트를 여기에 만듭니다. */}
          <pre>{JSON.stringify(result, null, 2)}</pre> 
        </div>
      )}
    </div>
  );
}

export default App;