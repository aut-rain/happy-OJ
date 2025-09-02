import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProblemPage from "@/pages/ProblemPage";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<div className="text-center text-xl py-10">题目列表页面 - 即将上线</div>} />
        <Route path="/problems/:id" element={<ProblemPage />} />
        <Route path="/submit/:id" element={<div className="text-center text-xl py-10">代码提交页面 - 即将上线</div>} />
        <Route path="/rankings" element={<div className="text-center text-xl py-10">排行榜页面 - 即将上线</div>} />
        <Route path="/contests" element={<div className="text-center text-xl py-10">竞赛页面 - 即将上线</div>} />
        <Route path="/login" element={<div className="text-center text-xl py-10">登录页面 - 即将上线</div>} />
        <Route path="/register" element={<div className="text-center text-xl py-10">注册页面 - 即将上线</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}
