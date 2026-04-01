/* eslint-disable max-len */
export const getPaginationParams = (total?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`Общее количество: ${total}`),
  })
  : {};

export const getPromotionPaginationParams = (total?: number, pageSize?: number) => total
  ? ({
    total,
    showTotal: (total: number) => (`${total} из ${pageSize} товаров на этой странице еще не добавлены в данную акцию, остальные товары вы можете увидеть перейдя на следующую страницу.`),
  })
  : {};
