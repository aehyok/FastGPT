import React, { useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { Box, chakra } from '@chakra-ui/react';
const RadioCard = ({ changeLanguage }: { changeLanguage: (val: string) => Promise<void> }) => {
  const [value, setValue] = useState('');
  const language = [
    {
      text: '中文'
    },
    {
      text: '英文'
    },
    {
      text: '法文'
    },
    {
      text: '意大利文'
    },
    {
      text: '西班牙文'
    }
  ];

  const setValueFun = async (val: string) => {
    // console.log(val, '不糊i更改');

    await setValue(val);
    await changeLanguage(val);
  };
  return (
    <RadioGroup onChange={setValueFun} value={value}>
      <Stack direction="row" display={'flex'} pb={4} pl={4} flexWrap={'wrap'}>
        <div>翻译为：</div>
        <Stack display={'flex'} direction="row" justifyContent={'space-around'}>
          {language?.length > 0
            ? language.map((item, index) => (
                <Radio value={item.text} key={item.text}>
                  {item.text}
                </Radio>
              ))
            : ''}
        </Stack>
      </Stack>
    </RadioGroup>
  );
};
export default RadioCard;
