import React from "react";
import { NetworkProvider } from "./context/NetworkContext";
import Layout from "./components/Layout";
import NetworkForm from "./components/NetworkForm";
import SubnetList from "./components/SubnetList";
import SubnetResults from "./components/SubnetResults";
import SubnetVisualization from "./components/SubnetVisualization";

function App() {
  return (
    <NetworkProvider>
      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <NetworkForm />
            <SubnetList />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <SubnetResults />
            <SubnetVisualization />
          </div>
        </div>
      </Layout>
    </NetworkProvider>
  );
}

export default App;
