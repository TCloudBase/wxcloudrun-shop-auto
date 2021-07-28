
-- DMC dump 1.0.0
-- ------------------------------------------------------
    
-- ----------------------------
-- Table structure for goods
-- ----------------------------
    
CREATE TABLE `goods` (
  `id` varchar(64) NOT NULL COMMENT '商品ID',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '商品名称',
  `imgs` varchar(1024) NOT NULL DEFAULT '' COMMENT '商品图片',
  `origin` double NOT NULL COMMENT '商品原价',
  `price` double NOT NULL COMMENT '商品价格',
  `options` varchar(1024) NOT NULL DEFAULT '' COMMENT '商品规格',
  `production` varchar(100) NOT NULL DEFAULT '' COMMENT '商品产地',
  `purchased` int(11) NOT NULL DEFAULT '0' COMMENT '购买次数',
  `descimages` varchar(128) NOT NULL DEFAULT '' COMMENT '描述长图',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='shop good'; 
      
INSERT INTO `goods` (`id`,`title`,`imgs`,`origin`,`price`,`options`,`production`,`purchased`,`descimages`) VALUES ('5b5be87f60ffbe510039159745f05c93','Smartisan 真无线TWS蓝牙耳机','[\"https://resource.smartisan.com/resource/52fcdb420db14c83448475f650df06c4.png\",\"https://resource.smartisan.com/resource/c3e8d0dbb61f41cbe86bd7684d58a968.png\",\"https://resource.smartisan.com/resource/e991f946530a7cfab3d9670dd8b1371b.png\",\"https://resource.smartisan.com/resource/465234ac5536cf3c5a8ab400e02d6b5f.png\",\"https://resource.smartisan.com/resource/46d45324f626b9ad40b4d49b74023f81.png\"]',249,49,'[{\"id\":43,\"key\":\"color\",\"name\":\"颜色\",\"value\":[\"白色\",\"绿色\"]}]','锤子科技',97,'[\"https://resource.smartisan.com/resource/8506a09cfe7ce79807df1347ead51386.png\"]');
INSERT INTO `goods` (`id`,`title`,`imgs`,`origin`,`price`,`options`,`production`,`purchased`,`descimages`) VALUES ('5b5be87f60ffbe51003915986f8d6189','坚果快充移动电源 20000mAh（45W MAX)','[\"https://resource.smartisan.com/resource/a9105af9998aba3ef254ca8b2e77935f.jpg\",\"https://resource.smartisan.com/resource/8c1016333860b52becfb5e67de6544ef.png\",\"https://resource.smartisan.com/resource/de1274f4c70fe3768417bb0454320089.png\",\"https://resource.smartisan.com/resource/cef8c7d10569efa64147e58c74393210.jpg\",\"https://resource.smartisan.com/resource/3c59aa911b831d4f0c7e2e7d2d2ee83e.jpg\"]',179,89,'[{\"id\":43,\"key\":\"color\",\"name\":\"颜色\",\"value\":[\"白色\"]}]','锤子科技',98,'[\"https://resource.smartisan.com/resource/20160ab6835c9b2202d1d2d78cbf5f9b.png\"]');
-- ----------------------------
-- Table structure for order
-- ----------------------------
    
CREATE TABLE `order` (
  `id` varchar(64) NOT NULL COMMENT '订单ID',
  `addressData` varchar(1024) DEFAULT '' COMMENT '订单地址',
  `deliveryType` varchar(20) DEFAULT '' COMMENT '配送方式',
  `commodityId` varchar(64) NOT NULL COMMENT '商品ID',
  `img` varchar(128) NOT NULL DEFAULT '' COMMENT '商品图片',
  `number` int(11) NOT NULL DEFAULT '0' COMMENT '购买数量',
  `openid` varchar(100) NOT NULL DEFAULT '' COMMENT '下单用户',
  `options` varchar(1024) NOT NULL DEFAULT '' COMMENT '商品规格',
  `price` double NOT NULL COMMENT '下单价格',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '商品名称',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '订单状态',
  `remark` varchar(100) DEFAULT '' COMMENT '订单备注',
  PRIMARY KEY (`id`),
  KEY `good` (`commodityId`),
  CONSTRAINT `good` FOREIGN KEY (`commodityId`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='shop good'; 
      
