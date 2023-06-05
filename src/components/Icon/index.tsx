import React from 'react';
import type { IconProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

const map = {
  model: require('./icons/model.svg').default,
  copy: require('./icons/copy.svg').default,
  chatSend: require('./icons/chatSend.svg').default,
  develop: require('./icons/develop.svg').default,
  users: require('./icons/users.svg').default,
  account: require('./icons/account.svg').default,
  menu: require('./icons/menu.svg').default,
  role: require('./icons/role.svg').default,
  statistics: require('./icons/statistics.svg').default,
  flow: require('./icons/flow.svg').default,
  guide: require('./icons/guide.svg').default,
  setting: require('./icons/setting.svg').default,
  promotion: require('./icons/promotion.svg').default,
  delete: require('./icons/delete.svg').default,
  withdraw: require('./icons/withdraw.svg').default,
  stop: require('./icons/stop.svg').default,
  shareMarket: require('./icons/shareMarket.svg').default,
  collectionLight: require('./icons/collectionLight.svg').default,
  collectionSolid: require('./icons/collectionSolid.svg').default,
  chat: require('./icons/chat.svg').default,
  invoice: require('./icons/invoice.svg').default,
  empty: require('./icons/empty.svg').default,
  back: require('./icons/back.svg').default,
  more: require('./icons/more.svg').default,
  tabbarChat: require('./icons/phoneTabbar/chat.svg').default,
  tabbarModel: require('./icons/phoneTabbar/model.svg').default,
  tabbarMore: require('./icons/phoneTabbar/more.svg').default,
  tabbarMe: require('./icons/phoneTabbar/me.svg').default,
  closeSolid: require('./icons/closeSolid.svg').default,
  wx: require('./icons/wx.svg').default,
  out: require('./icons/out.svg').default
};

export type IconName = keyof typeof map;

const MyIcon = ({ name, w = 'auto', h = 'auto', ...props }: { name: IconName } & IconProps) => {
  return map[name] ? (
    <Icon
      as={map[name]}
      w={w}
      h={h}
      boxSizing={'content-box'}
      verticalAlign={'top'}
      fill={'currentcolor'}
      {...props}
    />
  ) : null;
};

export default MyIcon;
