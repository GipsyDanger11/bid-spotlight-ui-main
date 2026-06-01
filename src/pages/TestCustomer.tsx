import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestCustomer = () => {
  const [items] = useState([
    {
      id: 1,
      name: "Test Watch",
      currentBid: 1000,
      category: "Watches",
      imageUrl: "🕰️"
    }
  ]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Customer Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="text-6xl text-center mb-4">{item.imageUrl}</div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-xl font-bold">${item.currentBid}</p>
              <Button className="w-full mt-4">Place Bid</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestCustomer;
