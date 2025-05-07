import React from "react";
import { useNetwork } from "../context/NetworkContext";
import { Plus, Trash2, Move } from "lucide-react";

const SubnetList: React.FC = () => {
  const { Subnets, addSubnet, updateSubnet, removeSubnet } = useNetwork();

  const handleChange = (id: string, field: string, value: string | number) => {
    updateSubnet(id, { [field]: value });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Subnet Requirements</h2>
        <button
          onClick={addSubnet}
          className="btn btn-secondary flex items-center space-x-1 text-sm"
        >
          <Plus size={16} />
          <span>Adicionar Subrede</span>
        </button>
      </div>

      <div className="space-y-3">
        {Subnets.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Nenhuma subrede adicionada. Clique em "Adicionnar Subrede" para criar uma.
          </div>
        ) : (
          Subnets.map((Subnet) => (
            <div key={Subnet.id} className="Subnet-card group">
              <div className="flex items-center mb-2">
                <Move size={16} className="text-gray-400 mr-2 cursor-move" />
                <div className="flex-grow">
                  <input
                    type="text"
                    value={Subnet.name}
                    onChange={(e) =>
                      handleChange(Subnet.id, "name", e.target.value)
                    }
                    className="form-input py-1 text-sm"
                    placeholder="Subnet Name"
                  />
                </div>
                <button
                  onClick={() => removeSubnet(Subnet.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Hosts
                </label>
                <input
                  type="number"
                  min="1"
                  value={Subnet.hosts}
                  onChange={(e) =>
                    handleChange(
                      Subnet.id,
                      "hosts",
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="form-input py-1"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {Subnets.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={addSubnet}
            className="btn btn-secondary flex items-center space-x-1 text-sm"
          >
            <Plus size={16} />
            <span>Adicionar outra subrede</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SubnetList;
