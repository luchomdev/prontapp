'use server'

import { cookies } from 'next/headers'

interface KPIData {
  activeCustomers: number;
  todayOrders: number;
  totalSales: number;
  profit: number;
}

interface ChartData {
  dailySalesData: any[][];
  dailySalesVsCostData: any[][];
  topProductsData: any[][];
}

interface Customer {
  name: string;
  email: string;
  orders: number;
}

export async function fetchDashboardData(startDate: string, endDate: string): Promise<{
  kpiData: KPIData;
  chartData: ChartData;
  customerData: Customer[];
}> {
  try {
    const cookieHeader = cookies().toString() || '';

    const [kpiResponse, chartResponse, customerResponse] = await Promise.all([
      // KPI data
      fetch(
        `${process.env.API_BASE_URL}/dashboard/kpis?start_date=${startDate}&end_date=${endDate}`,
        {
          credentials: 'include',
          headers: { 'Cookie': cookieHeader }
        }
      ),
      // Chart data
      fetch(
        `${process.env.API_BASE_URL}/dashboard/charts?start_date=${startDate}&end_date=${endDate}`,
        {
          credentials: 'include',
          headers: { 'Cookie': cookieHeader }
        }
      ),
      // Customer data
      fetch(
        `${process.env.API_BASE_URL}/dashboard/customer-order-stats?start_date=${startDate}&end_date=${endDate}`,
        {
          credentials: 'include',
          headers: { 'Cookie': cookieHeader }
        }
      )
    ]);

    if (!kpiResponse.ok || !chartResponse.ok || !customerResponse.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const [kpiData, chartData, customerData] = await Promise.all([
      kpiResponse.json(),
      chartResponse.json(),
      customerResponse.json()
    ]);

    return {
      kpiData,
      chartData,
      customerData
    };
  } catch (error) {
    console.error('Error in fetchDashboardData server action:', error);
    throw error;
  }
}

export async function fetchWalletBalance(): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/dashboard/wallet-balance`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch wallet balance');
    }

    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error('Error in fetchWalletBalance server action:', error);
    return 0;
  }
}