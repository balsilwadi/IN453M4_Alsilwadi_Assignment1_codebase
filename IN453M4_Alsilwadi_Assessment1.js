class Semaphore {
  constructor(count) {
      this.count = count;
      this.waiting = [];
  }

  acquire() {
      if (this.count > 0) {
          this.count--;
          return Promise.resolve(true);
      } else {
          return new Promise(resolve => this.waiting.push(resolve));
      }
  }

  release() {
      if (this.waiting.length > 0) {
          const resolve = this.waiting.shift();
          resolve(true);
      } else {
          this.count++;
      }
  }
}

class DressingRoom {
  constructor(numberOfRooms) {
      this.semaphore = new Semaphore(numberOfRooms);
  }

  async requestRoom() {
      await this.semaphore.acquire();
      // Simulating room usage
      return () => this.semaphore.release();
  }
}

class Customer {
  constructor(id, numberOfItems) {
      this.id = id;
      this.numberOfItems = numberOfItems;
  }

  async visitStore(dressingRoom) {
      const releaseRoom = await dressingRoom.requestRoom();
      const timeToTryOn = this.numberOfItems * (1 + Math.floor(Math.random() * 3)); // 1 to 3 minutes per item
      releaseRoom();
      console.log(`Customer ${this.id+1} entered the room with ${this.numberOfItems} items; Customer ${this.id+1} exited the room at ${timeToTryOn} minutes`)
      return timeToTryOn;
  }
}

// Main Simulation (Example Usage)
async function runSimulation(numCustomers, numRooms, itemsPerCustomer) {
  console.log(`\nStart scenario`)
  const dressingRoom = new DressingRoom(numRooms);
  let totalUsageTime = 0;
  let totalNumberOfItems = 0
  let totalWaitTime = 0

  for (let i = 0; i < numCustomers; i++) {
    let numberOfItems = 1 + Math.floor(Math.random() * 6)
    totalNumberOfItems += numberOfItems;
      const customer = new Customer(i,numberOfItems);
      const waitTime = await customer.visitStore(dressingRoom);
      totalUsageTime += waitTime;
      totalWaitTime = waitTime * i;
  }

  console.log(`Total number of customers: ${numCustomers}`)
  console.log(`Average number of items per customer: ${Math.round(totalNumberOfItems / numCustomers)}`)
  console.log(`Average usage time of rooms: ${Math.round(totalUsageTime / numCustomers)} minutes`)
  console.log(`Total wait time for rooms: ${totalUsageTime} minutes`)
  console.log(`End scenario\n`)
}

// Example run
async function runSimulations(){
  await runSimulation(10, 3, 0); // 10 customers, 3 dressing rooms, random number of items
  await runSimulation(20, 3, 0); // 20 customers, 3 dressing rooms, random number of items
  await runSimulation(30, 3, 0); // 30 customers, 3 dressing rooms, random number of items
}

runSimulations()

