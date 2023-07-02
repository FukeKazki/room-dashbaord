import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Card, Col, Grid, LineChart, Metric, Text, Title } from '@tremor/react'
import dayjs from 'dayjs'
const queryClient = new QueryClient()

function App() {
  return (
    <div className='bg-gray-100 min-h-[100vh]'>
      <QueryClientProvider client={queryClient}>
        <main className='container mx-auto p-10'>
          <Dashboard />
        </main>
      </QueryClientProvider>
    </div>
  )
}

type Infomation = {
  infomation: Array<{
    id: number;
    date: string;
    temperature: number;
    humidity: number;
  }>
}

const fetchInfomation = async () => {
  const res = await fetch('http://100.64.1.33/infomation.php')
  return res.json() as unknown as Infomation
}

const Dashboard = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: fetchInfomation,
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error

  const temperatureFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()}℃`;
  const humidityFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()}%`;

  return (
    <section>
      <Metric color='slate'>Dashboard</Metric>
      <Text className='mt-2'>部屋の情報を表示するダッシュボードです。</Text>
      <Grid numItems={2} className='gap-4 mt-4'>
        <Col numColSpan={1}>
          <Card>
            {data && (
              <>
                <Title>室温グラフ</Title>
                <LineChart
                  data={data?.infomation.map(v => ({ ...v, '室温': v.temperature, '日付': dayjs(v.date).format('HH:mm') }))}
                  categories={['室温']}
                  index='日付'
                  minValue={25}
                  valueFormatter={temperatureFormatter}
                />
              </>
            )}

          </Card>
        </Col>
        <Col numColSpan={1}>
          <Card>
            {data && (
              <>
                <Title>湿度グラフ</Title>
                <LineChart
                  data={data?.infomation.map(v => ({ ...v, '室温': v.temperature, '湿度': v.humidity, '日付': dayjs(v.date).format('HH:mm') }))}
                  categories={['湿度']}
                  index='日付'
                  minValue={40}
                  valueFormatter={humidityFormatter}
                />
              </>
            )}</Card>
        </Col>
        <Col numColSpan={2}>
          <Card>
            {data && (
              <>
                <LineChart
                  data={data?.infomation.map(v => ({ ...v, '室温': v.temperature, '湿度': v.humidity, '日付': dayjs(v.date).format('HH:mm') }))}
                  categories={['室温', '湿度']}
                  index='日付'
                />
              </>
            )}</Card>
        </Col>
      </Grid>
    </section>
  )
}

export default App
