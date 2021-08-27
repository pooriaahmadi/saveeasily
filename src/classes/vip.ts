import { VipInputs, VipModel } from "../types";

class Vip implements VipModel {
	id;
	start;
	end;
	constructor({ id, start, end }: VipInputs) {
		this.id = id;
		this.start = new Date(start);
		this.end = new Date(end);
	}
	isExpired = () => {
		const currentDate = new Date();
		if (currentDate > this.end) {
			return true;
		}
		return false;
	};
}

export default Vip;
