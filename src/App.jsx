import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

const deviceList = [
  {
    id: v4(),
    name: 'clx01',
    address: 'http://192.168.1.197:8877',
    relays: [
      { id: 1, active: false },
      { id: 2, name: 'Fan', active: true },
      { id: 3, active: false },
      { id: 4, active: false }
    ],
    schedules: [
      { id: v4(), time: '01:30', relay: 1, active: false },
      { id: v4(), time: '04:00', relay: 4, active: true },
    ]
  },
  {
    id: v4(),
    name: 'clx02',
    address: 'http://192.168.1.145:8877',
    relays: [
      { id: 1, name: '', active: false },
      { id: 2, name: '', active: true },
    ],
    schedules: [
      { id: v4(), time: '21:30', relay: 1, active: false },
    ]
  }
];

function App() {
  const [devices, setDevices] = useState(deviceList);
  const [activeDevice, setActiveDevice] = useState({});
  const [activeRelay, setActiveRelay] = useState({});
  const [active, setActive] = useState(false);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  useEffect(() => {
    // console.log(activeDevice)
  }, [activeDevice]
  );

  const relayOptions = activeDevice?.id ?
    activeDevice.relays
    : [];

  const deleteSchedule = (deviceId, selectedSchedule) => {
    if (!window.confirm(`delete ${selectedSchedule.time} - Relay ${selectedSchedule.relay} - ${selectedSchedule.time ? "ON" : "OFF"}?`)) {
      return false
    }
    console.log(deviceId, selectedSchedule)

    setDevices(devices => devices.map((device =>
    ({
      ...device,
      schedules: device.id !== deviceId ? device.schedules :
        device.schedules.filter(schedule => schedule.id !== selectedSchedule.id)
    })
    )))
  }

  const toggleRelay = (deviceId, selectedRelay) => {
    setDevices(devices => devices.map(device =>
    ({
      ...device,
      relays: device.relays.map(relay =>
      ({
        ...relay,
        active: (deviceId === device.id && relay.id === selectedRelay.id)
          ? !relay.active : relay.active
      }))
    })
    ))
  }

  const selectDevice = (deviceId) =>
    setActiveDevice(() => devices.find(device => device.id === deviceId))

  const selectRelay = (relayId) =>
    setActiveRelay(() => activeDevice.relays.find(relay => relay.id === parseInt(relayId)))

  const addSchedule = () => {
    const newSchedule = {
      deviceId: activeDevice.id,
      relayId: activeRelay.id,
      time: `${hour}:${minute}`,
      active
    };

    if (newSchedule.deviceId && newSchedule.relayId && hour && minute) {
      setDevices(prevDevices => {
        return prevDevices.map(
          prevDevice => ({
            ...prevDevice,

            schedules: prevDevice.id !== newSchedule.deviceId ? prevDevice.schedules :
              [
                ...prevDevice.schedules,
                {
                  id: v4(),
                  time: newSchedule.time,
                  relay: newSchedule.relayId,
                  active: newSchedule.active
                }
              ]

          })
        )
      })
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <form action="" onSubmit={e => e.preventDefault()}>
        <div className="" style={{ display: "flex", justifyContent: "center", flexWrap: 'wrap' }}>
          <div style={{ width: '100%', textAlign: 'center' }}>New</div>
          <div className="">
            <input required type="text" maxLength={2} style={{ width: '2em' }} value={hour} onChange={e => setHour(e.target.value)} />:
            <input required type="text" maxLength={2} style={{ width: '2em' }} value={minute} onChange={e => setMinute(e.target.value)} />
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <select onChange={(e) => selectDevice(e.target.value)}>
              <option value={{}}>= SELECT DEVICE =</option>
              {devices.map(device => <option key={device.id + '_s'} value={device.id}>{device.name}</option>)}
            </select>
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <select onChange={(e) => selectRelay(e.target.value)}>
              <option value={{}}>= SELECT RELAY =</option>
              {relayOptions.map(relay => <option key={relay.id + '_r'} value={relay.id}>{relay.name || 'R' + relay.id}</option>)}
            </select>
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <input required type="radio" name="active" value={true} checked={active} onChange={() => setActive(true)} /> ON
            {" ||"}
            <input required type="radio" name="active" value={false} checked={!active} onChange={() => setActive(false)} /> OFF
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <button onClick={addSchedule}>ADD</button>
          </div>
        </div>
      </form>

      <div className="">
        <ul style={{ listStyle: 'none' }}>
          {devices.map(device =>
            <li key={device.id}>
              <div style={{ border: '1px solid', marginBottom: 5, padding: "5px 7px" }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{device.name}</span>
                  <button style={{ border: 'none', background: 'inherit' }}>🔄</button>
                </div>

                <div className="" style={{ marginBottom: 10 }}>
                  <ul style={{ listStyle: 'none', display: 'flex' }}>
                    {device.relays?.map(relay =>
                      <li style={{ display: 'block', marginRight: 10 }} key={`${device.id}_${relay.id}`}>
                        <button onClick={() => toggleRelay(device.id, relay)}>
                          {relay.name || 'R' + relay.id}{" "}
                          <span style={{ color: relay.active ? 'green' : 'red' }}>{relay.active ? "ON" : "OFF"}</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="" style={{ border: '1px solid', padding: '10px 0' }}>
                  <ul style={{ listStyle: 'none' }}>
                    {device.schedules?.map(schedule => <li key={schedule.id}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: 100, marginBottom: 2 }}>
                          {schedule.time} R{schedule.relay}{" "}
                          <span style={{ color: schedule.active ? 'green' : 'red' }}>{schedule.active ? "ON" : "OFF"}</span>
                        </div>
                        <button onClick={() => deleteSchedule(device.id, schedule)} style={{ height: '100%' }}>x</button>
                      </div>
                    </li>)}
                  </ul>
                </div>

              </div>
            </li>
          )}
        </ul>
      </div>
    </div >
  )
}

export default App
