// src/App.jsx (기능을 설명하기 위한 간략한 예시 코드)
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // 간단한 스타일링을 위해 CSS 파일 import

// 백엔드 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL || 'https://naver-place-analyzer-production.up.railway.app';

// axios 기본 설정
axios.defaults.timeout = 120000; // 2분 타임아웃
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
      console.log('분석 요청 시작:', placeUrl);
      const response = await axios.post(`${API_URL}/analyze-place`, { 
        url: placeUrl 
      }, {
        timeout: 120000, // 2분 타임아웃
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('분석 응답 받음:', response.data);
      setResult(response.data.data); // 백엔드에서 받은 결과 저장
    } catch (err) {
      console.error('분석 에러:', err);
      if (err.response) {
        // 서버에서 응답이 왔지만 에러 상태인 경우
        setError(`서버 오류: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우 (CORS, 네트워크 등)
        setError('서버에 연결할 수 없습니다. CORS 설정이나 네트워크 연결을 확인해주세요.');
      } else {
        // 요청 자체를 보내지 못한 경우
        setError('요청을 보낼 수 없습니다. 네트워크 연결을 확인해주세요.');
      }
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
      console.log('키워드 순위 확인 요청 시작:', businessName, keywordList);
      const response = await axios.post(`${API_URL}/check-rankings`, {
        business_name: businessName,
        keywords: keywordList,
      }, {
        timeout: 120000, // 2분 타임아웃
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('키워드 순위 확인 응답 받음:', response.data);
      setResult(response.data.data);
    } catch (err) {
      console.error('키워드 순위 확인 에러:', err);
      if (err.response) {
        setError(`서버 오류: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        setError('서버에 연결할 수 없습니다. CORS 설정이나 네트워크 연결을 확인해주세요.');
      } else {
        setError('요청을 보낼 수 없습니다. 네트워크 연결을 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log('연결 테스트 시작');
      const response = await axios.get(`${API_URL}/health`);
      console.log('연결 테스트 성공:', response.data);
      alert('서버 연결이 정상입니다!');
    } catch (err) {
      console.error('연결 테스트 실패:', err);
      alert('서버 연결에 실패했습니다. CORS 설정을 확인해주세요.');
    }
  };

  const testSimpleEndpoint = async () => {
    try {
      console.log('간단한 테스트 시작');
      const response = await axios.get(`${API_URL}/test`);
      console.log('간단한 테스트 성공:', response.data);
      alert('간단한 테스트 성공! 서버가 정상 작동 중입니다.');
    } catch (err) {
      console.error('간단한 테스트 실패:', err);
      alert('간단한 테스트 실패. 서버가 응답하지 않습니다.');
    }
  };

  return (
    <div className="container">
      <h1>미래엔영어 네이버플레이스 점검 도구</h1>
      
      {/* 연결 테스트 버튼들 추가 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={testConnection} style={{ 
          padding: '8px 16px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          서버 연결 테스트
        </button>
        <button onClick={testSimpleEndpoint} style={{ 
          padding: '8px 16px', 
          backgroundColor: '#2196F3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          간단한 테스트
        </button>
      </div>

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