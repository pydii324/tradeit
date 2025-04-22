"use client"

import { useState } from "react"
import { usePage, router } from "@inertiajs/react"
import ClosePositionButton from "./close-position"

interface Position {
  id: number
  market: string
  amount: number
  leverage: number
  entry_price: number
  exit_price: number
  type: "long" | "short"
  liquidation_price?: number
}

const PositionHistory = () => {
  const { position_history } = usePage().props;

  const calculatePNL = (position: Position) => {
    const { amount: margin, entry_price: entry, exit_price: exit,leverage, type } = position
  
    // Calculate actual position size (contracts)
    const size = (margin * leverage) / entry
  
    if (type === "short") {
      return (entry - exit) * size
    } else {
      return (exit - entry) * size
    }
  }
  

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Position History</h3>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Symbol</th>
              <th className="py-2">Size</th>
              <th className="py-2">Leverage</th>
              <th className="py-2">Margin</th>
              <th className="py-2">Entry price</th>
              <th className="py-2">Exit price</th>
              <th className="py-2">PNL</th>
            </tr>
          </thead>
          <tbody>
            {position_history.length > 0 ? (
              position_history.map((position) => (
                <tr key={position.id} className="border-b">
                  <td className="py-2 font-bold">
                    {position.market} {position.type === "long" ? "Long" : "Short"}
                  </td>
                  <td className="py-2">${position.amount * position.leverage}</td>
                  <td className="py-2">{position.leverage}x</td>
                  <td className="py-2">${Number(position.amount).toFixed(2)}</td>
                  <td className="py-2">${Number(position.entry_price).toFixed(2)}</td>
                  <td className="py-2">${Number(position.exit_price).toFixed(2)}</td>
                  <td
                    className={`py-2 ${calculatePNL(position) >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ${Math.abs(calculatePNL(position)).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-center text-gray-500" colSpan={8}>
                  No trade history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Shown only on mobile */}
      <div className="md:hidden space-y-4">
        {position_history.length > 0 ? (
          position_history.map((position) => {
            const pnl = calculatePNL(position)
            const isProfitable = pnl >= 0

            return (
              <div key={position.id} className="bg-accent rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-base">{position.market}</span>
                  <span className={`font-semibold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                    ${Math.abs(pnl).toFixed(2)} {isProfitable ? "▲" : "▼"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p>${position.amount * position.leverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Leverage</p>
                    <p>{position.leverage}x</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Margin</p>
                    <p>${Number(position.amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Entry</p>
                    <p>${Number(position.entry_price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-xs">Liq. Price: </span>
                    <span className="text-xs">${position.liquidation_price?.toFixed(2) || "N/A"}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500">No position history</div>
        )}
      </div>
    </div>
  )
}

export default PositionHistory
