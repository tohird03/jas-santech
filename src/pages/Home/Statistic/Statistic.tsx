import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import classNames from 'classnames';
import styles from './statistic.scss';
import { CalendarOutlined} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { ordersStore } from '@/stores/products';
import { getStartAndEndDate, getStartMonthEndDate } from '@/utils/getDateFormat';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { clientsInfoStore } from '@/stores/clients';
import { IClientDebtFilter } from '@/api/clients';
import { supplierInfoStore } from '@/stores/supplier';
import { ISupplierDebtFilter } from '@/api/supplier/types';
import { homeStore } from '@/stores/home/home';
import { IOrderGraphStatisticType } from '@/api/statistic/types';

const cn = classNames.bind(styles);
const formatter = (value: number) => <CountUp duration={2} end={value} separator=" " />;

const graphTypes = [
  IOrderGraphStatisticType.DAY,
  IOrderGraphStatisticType.WEEK,
  IOrderGraphStatisticType.MONTH,
  IOrderGraphStatisticType.YEAR,
];

export const Statistic = observer(() => {
  const [timeRangeIndex, setTimeRangeIndex] = useState(1); // 0 - DAILY
  const timeRange = graphTypes[timeRangeIndex];

  const navigate = useNavigate();
  const { data: ordersStatisticData, isLoading: loading } = useQuery({
    queryKey: ['getOrdersStatistic'],
    queryFn: () => homeStore.getOrdersStatistic(),
  });

  const { data: ordersGraphStatisticData, isLoading: loadingGraph } = useQuery({
    queryKey: ['getOrdersGraphStatistic', timeRange],
    queryFn: () => homeStore.getOrdersGraphStatistic(timeRange),
  });

  const chartOptions = {
    options: {
      chart: {
        id: 'basic-bar',
        toolbar: {
          show: true,
          tools: {
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      stroke: {
        stroke: {
          curve: 'smooth',
          dashArray: 0,
        },
        fill: {
          color: 'red',
          pattern: {
            strokeWidth: 10,
            style: 'none',
            width: 100,
          },
        },
      },
      xaxis: {
        categories: ordersGraphStatisticData?.map(value => value?.date),
      },
      yaxis: {
        tickAmount: 10,
      },
      markers: {
        size: 6,
        colors: ['#fff'],
        strokeColors: '#f18024',
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#f18024'],
    },
    noData: {
      text: loadingGraph ? 'Yuklanmoqda...' : 'Maʼlumot yoʻq',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#999',
        fontSize: '16px',
      },
    },
    series: [
      {
        name: 'Sotuv',
        data: ordersGraphStatisticData?.map(value => value?.sum || 0) || [],
      },
    ],
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        setTimeRangeIndex(prev => Math.min(prev + 1, graphTypes.length - 1));
      } else if (e.deltaY > 0) {
        setTimeRangeIndex(prev => Math.max(prev - 1, 0));
      }
    };

    const chartDiv = document.getElementById('scrollable-chart');

    chartDiv?.addEventListener('wheel', handleWheel);

    return () => {
      chartDiv?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleClickTodayOrder = () => {
    navigate(ROUTES.productsOrder);
  };

  const handleClickTodayWeek = () => {
    ordersStore.setStartDate(getStartAndEndDate(7)?.startDate);
    ordersStore.setEndDate(getStartAndEndDate(7)?.endDate);
    navigate(ROUTES.productsOrder);
  };

  const handleClickMonth = () => {
    ordersStore.setStartDate(getStartMonthEndDate()?.startDate);
    ordersStore.setEndDate(getStartMonthEndDate()?.endDate);
    navigate(ROUTES.productsOrder);
  };

  const handleClickClient = () => {
    clientsInfoStore.setDebtType(IClientDebtFilter.GREATER);
    clientsInfoStore.setPageSize(500);
    navigate(ROUTES.clientsInfo);
  };

  const handleClickSupplier = () => {
    supplierInfoStore.setDebtType(ISupplierDebtFilter.GREATER);
    supplierInfoStore.setPageSize(100);
    navigate(ROUTES.supplierInfo);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', padding: '30px' }}>
      <div className={cn('statistic__top-wrapper')}>
        <div className={cn('statistic__top-order')}>
          <h3 className={cn('statistic__top-heading')}>Sotuvlar</h3>
          <div className={cn('statistic__top-order-card')}>
            <Card onClick={handleClickTodayOrder} className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Bugun</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.daily || 0)}
              </p>
            </Card>
            <Card onClick={handleClickTodayWeek} className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Shu hafta</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.weekly || 0)}
              </p>
            </Card>
            <Card onClick={handleClickMonth} className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Shu oy</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.monthly || 0)}
              </p>
            </Card>
          </div>
        </div>
        <div className={cn('statistic__top-order')}>
          <h3 className={cn('statistic__top-heading')}>Mijozlar</h3>
          <Card onClick={handleClickClient} className={cn('statistic__top-card')}>
            <div className={cn('statistic__debts')}>
              <div>
                <p className={cn('statistic__top-card-info')}>Bizga qarz</p>
                <p className={cn('statistic__top-card-value')}>
                  {formatter(ordersStatisticData?.client?.theirDebt || 0)}
                </p>
              </div>
              <div>
                <p className={cn('statistic__top-card-info')}>Bizning qarz</p>
                <p className={cn('statistic__top-card-value')}>
                  {formatter(ordersStatisticData?.client?.ourDebt || 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className={cn('statistic__top-order')}>
          <h3 className={cn('statistic__top-heading')}>Yetkazib beruvchilar</h3>
          <Card onClick={handleClickSupplier} className={cn('statistic__top-card')}>
            <div className={cn('statistic__debts')}>
              <div>
                <p className={cn('statistic__top-card-info')}>Bizning qarz</p>
                <p className={cn('statistic__top-card-value')}>
                  {formatter(ordersStatisticData?.supplier?.ourDebt || 0)}
                </p>
              </div>
              <div>
                <p className={cn('statistic__top-card-info')}>Bizga qarz</p>
                <p className={cn('statistic__top-card-value')}>
                  {formatter(ordersStatisticData?.supplier?.theirDebt || 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <div id="scrollable-chart">
          <h1>Oraliq: {['Bugungi', 'Shu hafta', 'Shu oy', 'Shu yil'][timeRangeIndex]}</h1>
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="area"
            height={350}
          />
        </div>
      </Card>
    </div>
  );
});
