"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Chart } from "react-google-charts";
import { fetchDashboardData } from '@/app/(admin)/actions/dashboard';

interface Customer {
  "name": string;
  "email": string;
  "orders": number;
}

// Componentes para KPIs individuales
const KPICard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Componente para mostrar cuando no hay datos
const NoDataMessage = () => (
  <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
    <p className="text-xl text-gray-500">No hay datos disponibles para el período seleccionado</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  });
  const [kpiData, setKpiData] = useState({ activeCustomers: 0, todayOrders: 0, totalSales: 0, profit: 0 });
  const [chartData, setChartData] = useState({ dailySalesData: [], dailySalesVsCostData: [], topProductsData: [] });
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatChartData = useCallback((data: any) => {
    return {
      dailySalesData: data.dailySalesData.map((row: any[], index: number) => 
        index === 0 ? row : [formatDate(row[0]), row[1]]
      ),
      dailySalesVsCostData: data.dailySalesVsCostData.map((row: any[], index: number) => 
        index === 0 ? row : [formatDate(row[0]), row[1], row[2]]
      ),
      topProductsData: data.topProductsData.map((row: any[], index: number) => 
        index === 0 ? row : [row[0].toLowerCase(), row[1]]
      )
    };
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDashboardData(dateRange.start, dateRange.end);
      const formattedChartData = formatChartData(data.chartData);
      
      setKpiData(data.kpiData);
      setChartData(formattedChartData);
      setCustomerData(data.customerData);

      // Verificar si hay datos
      const hasData = data.kpiData.totalSales > 0 || data.customerData.length > 0;
      setHasData(hasData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, formatChartData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateData = () => {
    fetchData();
  };

  // Opciones para los gráficos
  const orderChartOptions = {
    title: "Cantidad de Órdenes por Día",
    hAxis: { title: "Fecha" },
    vAxis: { title: "Cantidad de Órdenes" },
    legend: { position: "none" },
  };

  const salesChartOptions = {
    title: "Ventas Diarias",
    hAxis: { title: "Fecha" },
    vAxis: { title: "Monto ($)" },
  };

  const topProductsChartOptions = {
    title: "Top 10 Productos Más Vendidos",
    hAxis: { title: "Ventas" },
    vAxis: { title: "Producto" },
    legend: { position: "none" },
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando datos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Previsualización panorama de la gestión</h1>
      
      {/* Selector de rango de fechas */}
      <div className="mb-6 flex items-center">
        <label className="mr-2">Rango de fechas:</label>
        <input
          type="date"
          name="start"
          value={dateRange.start}
          onChange={handleDateRangeChange}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          name="end"
          value={dateRange.end}
          onChange={handleDateRangeChange}
          className="mr-2 p-2 border rounded"
        />
        <button 
          onClick={handleUpdateData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Actualizar
        </button>
      </div>

      {hasData ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <KPICard title="Número de Clientes" value={kpiData.activeCustomers} />
            <KPICard title="Número de Órdenes Hoy" value={kpiData.todayOrders} />
            <KPICard title="Ventas en el período" value={`$${kpiData.totalSales.toLocaleString()}`} />
            <KPICard title="Ganancias en el período" value={`$${kpiData.profit.toLocaleString()}`} />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              {chartData.dailySalesData.length > 1 ? (
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="400px"
                  data={chartData.dailySalesData}
                  options={orderChartOptions}
                />
              ) : (
                <NoDataMessage />
              )}
            </div>
            <div>
              {chartData.dailySalesVsCostData.length > 1 ? (
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="400px"
                  data={chartData.dailySalesVsCostData}
                  options={salesChartOptions}
                />
              ) : (
                <NoDataMessage />
              )}
            </div>
          </div>

          {/* Top 10 Productos Más Vendidos */}
          <div className="mb-8">
            {chartData.topProductsData.length > 1 ? (
              <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={chartData.topProductsData}
                options={topProductsChartOptions}
              />
            ) : (
              <NoDataMessage />
            )}
          </div>

          {/* Listado de Clientes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Clientes con Compras en el Período</h2>
            {customerData.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Nombre</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Número de Órdenes</th>
                  </tr>
                </thead>
                <tbody>
                  {customerData.map((customer) => (
                    <tr key={`${customer.email}${customer.orders}`}>
                      <td className="py-2 px-4">{customer.name}</td>
                      <td className="py-2 px-4">{customer.email}</td>
                      <td className="py-2 px-4">{customer.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoDataMessage />
            )}
          </div>
        </>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

export default AdminDashboard;