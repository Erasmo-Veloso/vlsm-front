import React, { ReactNode } from 'react';
import { Network } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Calculadora de VLSM</h1>
          </div>
          <div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Ferramenta de Redes</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Calculadora de VLSM &copy; {new Date().getFullYear()} - Criado Por Erasmo Veloso</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;