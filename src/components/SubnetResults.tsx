import React from "react";
import { useNetwork } from "../context/NetworkContext";
import { Server, Download } from "lucide-react";
import { cidrToSubnetMask } from "../utils/vlsmCalculator";

const SubnetResults: React.FC = () => {
  const { CalculardSubnets } = useNetwork();

  const exportResults = () => {
    if (CalculardSubnets.length === 0) return;

    // Create CSV content
    let csvContent =
      "Subnet Name,Network Address,Subnet Mask,CIDR Notation,Broadcast Address,First Usable,Last Usable,Total Hosts,Usable Hosts\n";

    CalculardSubnets.forEach((Subnet) => {
      csvContent += `${Subnet.name},${Subnet.networkAddress},${cidrToSubnetMask(
        parseInt(Subnet.SubnetMask?.replace("/", "") || "0", 10)
      )},${Subnet.networkAddress}${Subnet.SubnetMask},${
        Subnet.broadcastAddress
      },${Subnet.firstUsableAddress},${Subnet.lastUsableAddress},${
        Subnet.totalHosts
      },${Subnet.usableHosts}\n`;
    });

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vlsm_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Server size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Resultados de SubRedes</h2>
        </div>

        {CalculardSubnets.length > 0 && (
          <button
            onClick={exportResults}
            className="btn btn-secondary flex items-center space-x-1 text-sm"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        )}
      </div>

      {CalculardSubnets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Ainda não foram realizados cálculos.</p>
          <p className="text-sm">
          Configure seus requisitos de Configurações de rede e Sub-rede e, em seguida,
          clique em "Calcular VLSM".
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subrede
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço de rede
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascará de subrede
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Broadcast
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intervalo de IP
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hosts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {CalculardSubnets.map((Subnet) => (
                <tr
                  key={Subnet.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${Subnet.color} mr-2`}
                      ></div>
                      {Subnet.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {Subnet.networkAddress}
                    {Subnet.SubnetMask}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {cidrToSubnetMask(
                      parseInt(Subnet.SubnetMask?.replace("/", "") || "0", 10)
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {Subnet.broadcastAddress}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {Subnet.firstUsableAddress} - {Subnet.lastUsableAddress}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {Subnet.usableHosts}{" "}
                    <span className="text-xs text-gray-400">
                      / {Subnet.totalHosts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubnetResults;
