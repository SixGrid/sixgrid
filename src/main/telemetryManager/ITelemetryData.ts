export interface ITelemetryData<T>
{
    Data?: T
    DataType: string
    Channel: string    
}
export class TelemetryData<T> implements ITelemetryData<T>
{
    public Data?: T = null
    public DataType: string = ''
    public Channel: string = ''

    public constructor(x: new () => T)
    {
        this.DataType = x.name
    }
}