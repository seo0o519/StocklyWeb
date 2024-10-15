import like from '../../assets/icons/like.svg';
import like_hover from '../../assets/icons/like_hover.svg';
import alert from '../../assets/icons/alert.svg';
import alert_hover from '../../assets/icons/alert_hover.svg';
import { useState } from 'react';
import * as React from 'react';
import Menu from '@mui/material/Menu';

function TopContent() {
  const [likeSrc, setLikeSrc] = useState(like);
  const [alertSrc, setAlertSrc] = useState(alert);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-between w-full ">
      {/* 회사 정보 추후에 get 해올 것 */}
      <div className="flex justify-center items-center">
        <div className="text-[20px] font-bold m-10px"> 삼성 전자</div>
        <div className="text-[19px] text-[#B4BDC6] m-[10px]">005930</div>
      </div>

      <div className="flex">
        <button
          onClick={handleClick}
          id="basic-button"
          aria-haspopup="true"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          className="mx-[10px]"
        >
          <img
            src={alertSrc}
            className="cursor-pointer w-full h-full w-[48.5px] h-[48.5px] mr-[10px]"
            alt="알림"
            onMouseEnter={() => setAlertSrc(alert_hover)} // hover 상태일 때
            onMouseLeave={() => setAlertSrc(alert)} // 기본 상태로 복귀
          />
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            '& .MuiPaper-root': { borderRadius: '10px' },
          }}
          anchorOrigin={{
            vertical: 'bottom', // 버튼의 아래쪽에 메뉴가 나타나도록 설정
            horizontal: 'right', // 버튼의 왼쪽에 맞춰서 나타나도록 설정
          }}
          transformOrigin={{
            vertical: 'top', // 메뉴의 위쪽이 버튼 아래로 연결
            horizontal: 'right', // 메뉴의 왼쪽이 버튼 왼쪽에 맞춰짐
          }}
        >
          <div className="w-[250px] h-[200px] rounded-[100px]">
            <div className="m-[20px]">
              삼성전자가
              <br />
              얼마일 때 알려드릴까요?
            </div>
            <input
              className="border border-MainBlue rounded-[5px] mx-[20px] my-[10px] px-[10px] "
              placeholder="가격을 입력하세요"
            ></input>
          </div>
          <div>
            <div className="w-full flex justify-end ">
              <button className=" m-[20px] bg-MainBlue text-white w-[60px] h-[30px] text-[13px] rounded-[3px]">
                알림 받기
              </button>
            </div>
          </div>
        </Menu>
        <img
          src={likeSrc}
          className="mr-[30px] cursor-pointer w-[48.5px] h-[48.5px]"
          alt="좋아요"
          onMouseEnter={() => setLikeSrc(like_hover)} // hover 상태일 때
          onMouseLeave={() => setLikeSrc(like)} // 기본 상태로 복귀
        />
      </div>
    </div>
  );
}

export default TopContent;
