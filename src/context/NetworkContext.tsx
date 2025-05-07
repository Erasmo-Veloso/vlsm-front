import React, { createContext, useContext, useState, ReactNode } from "react";
import { CalcularSubnets } from "../utils/vlsmCalculator";

export interface Subnet {
  id: string;
  name: string;
  hosts: number;
  networkAddress?: string;
  SubnetMask?: string;
  broadcastAddress?: string;
  firstUsableAddress?: string;
  lastUsableAddress?: string;
  totalHosts?: number;
  usableHosts?: number;
  color?: string;
}

interface NetworkContextType {
  baseNetwork: string;
  SubnetMask: string;
  Subnets: Subnet[];
  CalculardSubnets: Subnet[];
  setBaseNetwork: (network: string) => void;
  setSubnetMask: (mask: string) => void;
  addSubnet: () => void;
  updateSubnet: (id: string, updates: Partial<Subnet>) => void;
  removeSubnet: (id: string) => void;
  CalcularVLSM: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const colorPalette = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [baseNetwork, setBaseNetwork] = useState("192.168.0.0");
  const [SubnetMask, setSubnetMask] = useState("24");
  const [Subnets, setSubnets] = useState<Subnet[]>([
    { id: "1", name: "Subnet 1", hosts: 100 },
    { id: "2", name: "Subnet 2", hosts: 50 },
  ]);
  const [CalculardSubnets, setCalculardSubnets] = useState<Subnet[]>([]);

  const addSubnet = () => {
    const newSubnet: Subnet = {
      id: Date.now().toString(),
      name: `Subnet ${Subnets.length + 1}`,
      hosts: 10,
    };
    setSubnets([...Subnets, newSubnet]);
  };

  const updateSubnet = (id: string, updates: Partial<Subnet>) => {
    const updatedSubnets = Subnets.map((Subnet) =>
      Subnet.id === id ? { ...Subnet, ...updates } : Subnet
    );
    setSubnets(updatedSubnets);
  };

  const removeSubnet = (id: string) => {
    const updatedSubnets = Subnets.filter((Subnet) => Subnet.id !== id);
    setSubnets(updatedSubnets);
  };

  const CalcularVLSM = () => {
    // Call the API or calculation function
    const sorted = [...Subnets].sort((a, b) => b.hosts - a.hosts);

    // Temporary placeholder for API call
    const results = CalcularSubnets(baseNetwork, parseInt(SubnetMask), sorted);

    // Apply colors from palette
    const resultsWithColors = results.map((Subnet, index) => ({
      ...Subnet,
      color: colorPalette[index % colorPalette.length],
    }));

    setCalculardSubnets(resultsWithColors);
  };

  return (
    <NetworkContext.Provider
      value={{
        baseNetwork,
        SubnetMask,
        Subnets,
        CalculardSubnets,
        setBaseNetwork,
        setSubnetMask,
        addSubnet,
        updateSubnet,
        removeSubnet,
        CalcularVLSM,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
