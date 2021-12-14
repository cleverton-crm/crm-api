import { createParamDecorator } from '@nestjs/common';
import axios from 'axios';

export const IpAddress = createParamDecorator(async (data, req) => {
  const url =
    'http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query';
  let dataResponse;
  const response = await axios.get(url).then((response) => {
    dataResponse = response.data;
  });
  return dataResponse;
});
