import React, { useState } from 'react';
import './App.css';

// API URL 설정
const API_URL = 'https://naver-place-analyzer-production.up.railway.app';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [placeUrl, setPlaceUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 서버 연결 테스트
  const testConnection = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/test`);
      const data = await response.json();
      
      if (response.ok) {
        alert('서버 연결 성공!');
        console.log('서버 응답:', data);
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (err) {
      console.error('연결 테스트 실패:', err);
      alert('서버 연결 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 플레이스 분석
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: placeUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        throw new Error(data.message || '분석 실패');
      }
    } catch (err) {
      console.error('분석 오류:', err);
      setError('분석 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 키워드 순위 확인
  const handleCheckRankings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);

    try {
      const response = await fetch(`${API_URL}/check-rankings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: businessName,
          keywords: keywordList,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        throw new Error(data.message || '순위 확인 실패');
      }
    } catch (err) {
      console.error('순위 확인 오류:', err);
      setError('순위 확인 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>네이버 플레이스 분석기</h1>
      
      {/* 연결 테스트 버튼 */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '테스트 중...' : '서버 연결 테스트'}
        </button>
      </div>

      {/* 탭 버튼 */}
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('analyze')} 
          className={activeTab === 'analyze' ? 'active' : ''}
        >
          플레이스 분석
        </button>
        <button 
          onClick={() => setActiveTab('rank')} 
          className={activeTab === 'rank' ? 'active' : ''}
        >
          키워드 순위 확인
        </button>
      </div>

      {/* 플레이스 분석 폼 */}
      {activeTab === 'analyze' && (
        <form onSubmit={handleAnalyze} className="form">
          <h3>분석할 네이버 플레이스 URL</h3>
          <input
            type="url"
            value={placeUrl}
            onChange={(e) => setPlaceUrl(e.target.value)}
            placeholder="https://map.naver.com/p/..."
            required
            className="input"
          />
          <button type="submit" disabled={loading} className="button">
            {loading ? '분석 중...' : '분석 시작'}
          </button>
        </form>
      )}

      {/* 키워드 순위 확인 폼 */}
      {activeTab === 'rank' && (
        <form onSubmit={handleCheckRankings} className="form">
          <h3>업체명</h3>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="정확한 상호명을 입력하세요"
            required
            className="input"
          />
          <h3>확인할 키워드</h3>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="쉼표(,)로 구분하여 키워드를 입력하세요"
            required
            className="textarea"
          />
          <button type="submit" disabled={loading} className="button">
            {loading ? '순위 확인 중...' : '순위 확인 시작'}
          </button>
        </form>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="error">
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 로딩 메시지 */}
      {loading && (
        <div className="loading">
          처리 중입니다... 잠시만 기다려주세요.
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="results">
          <h2>분석 결과</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;