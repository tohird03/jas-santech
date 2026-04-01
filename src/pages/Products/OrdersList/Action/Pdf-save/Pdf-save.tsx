import React, { forwardRef } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Path } from '@react-pdf/renderer';
import { IOrder } from '@/api/order/types';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import LogoImg from '@/assets/img/logo-all.png';
import CheckmarkIcon from '@/assets/img/check-mark.png';
import { phoneFormat } from '@/utils/phoneFormat';

Font.register({
  family: 'NotoSans',
  src: '/fonts/noto.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'NotoSansBold',
  fontWeight: 'bold',
  src: '/fonts/NotoSans-Bold.ttf',
});

type Props = {
  order: IOrder;
};

export const MyDocument = forwardRef<any, Props>(({ order }, ref) => (
  <Document ref={ref}>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.topData}>
          <View style={styles.titleInfo}>
            <View style={styles.title}>
              <Text style={styles.titleSpan}>Дата продажа:</Text>
              <Text style={styles.titleSpanData}>{getFullDateFormat(order?.date)}</Text>
            </View>
            <View style={styles.title}>
              <Text style={styles.titleSpan}>Харидор:</Text>
              <Text style={styles.titleSpanData}>{order?.client?.fullname}    {phoneFormat(order?.client?.phone?.slice(3))}</Text>
            </View>
          </View>
          <View>
            <Image style={styles.logoImage} src={LogoImg} />
          </View>
        </View>

        {/* Jadval */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '30px' }}>№</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '280px', minWidth: '280px' }}>Махсулот номи</Text>
            <Text style={{ ...styles.tableHeaderCell, maxWidth: '35px' }}>
              <Image src={CheckmarkIcon} style={{ width: 10, height: 10 }} />
            </Text>
            <Text style={{ ...styles.tableHeaderCell }}>Сони</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Нархи</Text>
            <Text style={{ ...styles.tableHeaderCell }}>Суммаси</Text>
          </View>
          {
            order?.products?.map((product, index) => (
              <View key={product?.id} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, maxWidth: '30px' }}>{index + 1}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '280px', minWidth: '280px', textAlign: 'left' }}>{product?.product?.name}</Text>
                <Text style={{ ...styles.tableCell, maxWidth: '35px' }} />
                <Text style={{ ...styles.tableCell }}>{product?.count}</Text>
                <Text style={{ ...styles.tableCell }}>{product?.price}</Text>
                <Text style={{ ...styles.tableCell }}>{priceFormat(product?.count * product?.price)}</Text>
              </View>
            ))
          }
        </View>
        <View>
          <View style={styles.totalCalcTextWrapper}>
            <Text style={styles.totalCalcText}>Жами сумма:</Text>
            <Text style={styles.totalCalcPriceText}>{order?.totalPrice}</Text>
          </View>
          <View style={styles.totalCalcTextWrapper}>
            <Text style={styles.totalCalcText}>Тулов килинди:</Text>
            <Text style={styles.totalCalcPriceText}>{order?.totalPayment || 0}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
));

// PDF uchun stil
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  logo: {
    textAlign: 'center',
    fontSize: '28px',
    fontFamily: 'NotoSansBold',
  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: -40,
  },
  titleInfo: {
    marginBottom: -30,
  },
  title: {
    fontSize: 12,
    fontFamily: 'NotoSans',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    width: '70%',
  },
  titleSpan: {
    fontSize: 12,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
    marginRight: 30,
  },
  titleSpanData: {
    fontSize: 12,
    fontFamily: 'NotoSans',
    maxWidth: '70%',
  },
  logoImage: {
    width: 120,
    height: 160,
    marginRight: 40,
  },
  content: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    marginTop: -30,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'NotoSansBold',
    fontSize: 10,
    padding: 3,
    borderRightWidth: 1,
    borderColor: 'black',
    fontWeight: 800,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding: 3,
    borderRightWidth: 1,
    borderColor: 'black',
    fontSize: 9,
  },
  totalCalcTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  totalCalcText: {
    textAlign: 'right',
    fontSize: 9,
    fontFamily: 'NotoSansBold',
    fontWeight: 'bold',
  },
  totalCalcPriceText: {
    textAlign: 'left',
    fontSize: 9,
    fontFamily: 'NotoSans',
    width: 100,
  },
});
