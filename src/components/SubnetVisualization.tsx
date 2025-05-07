import React, { useState } from "react";
import { useNetwork } from "../context/NetworkContext";
import { BarChart3 } from "lucide-react";

const SubnetVisualization: React.FC = () => {
  const { CalculardSubnets } = useNetwork();
  const [selectedSubnet, setSelectedSubnet] = useState<string | null>(null);

  // If no Subnets, return empty visualization
  if (CalculardSubnets.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Visualização da Rede</h2>
        </div>
        <div className="bg-gray-100 rounded-lg h-56 flex items-center justify-center">
          <p className="text-gray-500">Calcular subredes para ver a visualização</p>
        </div>
      </div>
    );
  }

  // Calcular total hosts across all Subnets for proportional sizing
  const totalHosts = CalculardSubnets.reduce(
    (sum, Subnet) => sum + (Subnet.totalHosts || 0),
    0
  );

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 size={20} className="text-blue-600" />
        <h2 className="text-xl font-semibold">Visualização da Rede</h2>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Visual representation */}
        <div className="flex h-20 rounded-lg overflow-hidden">
          {CalculardSubnets.map((Subnet) => {
            const percentage = ((Subnet.totalHosts || 0) / totalHosts) * 100;
            return (
              <div
                key={Subnet.id}
                className={`Subnet-visualization-block ${Subnet.color} relative`}
                style={{ width: `${percentage}%` }}
                onMouseEnter={() => setSelectedSubnet(Subnet.id)}
                onMouseLeave={() => setSelectedSubnet(null)}
              >
                {percentage > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {Subnet.name}
                  </div>
                )}
                {selectedSubnet === Subnet.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-md p-3 z-10 w-64">
                    <p className="font-semibold">{Subnet.name}</p>
                    <p className="text-sm">
                      Network: {Subnet.networkAddress}
                      {Subnet.SubnetMask}
                    </p>
                    <p className="text-sm">
                      Hosts: {Subnet.usableHosts} usável / {Subnet.totalHosts}{" "}
                      total
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {CalculardSubnets.map((Subnet) => (
            <div key={Subnet.id} className="flex items-center text-sm">
              <div
                className={`w-3 h-3 rounded-full ${Subnet.color} mr-2`}
              ></div>
              <span className="truncate">{Subnet.name}</span>
            </div>
          ))}
        </div>

        {/* Overall network usage statistics */}
        <div className="bg-gray-50 p-3 rounded-md mt-4">
          <h3 className="text-sm font-medium mb-2">Alocação da rede</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total subRedes</p>
              <p className="font-medium">{CalculardSubnets.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Total endereços de IP</p>
              <p className="font-medium">{totalHosts}</p>
            </div>
            <div>
              <p className="text-gray-500">Endereços usáveis</p>
              <p className="font-medium">
                {CalculardSubnets.reduce(
                  (sum, Subnet) => sum + (Subnet.usableHosts || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubnetVisualization;
