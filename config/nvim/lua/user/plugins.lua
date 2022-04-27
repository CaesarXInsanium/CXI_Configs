local fn = vim.fn

-- Automatically install packer
local install_path = fn.stdpath "data" .. "/site/pack/packer/start/packer.nvim"
if fn.empty(fn.glob(install_path)) > 0 then
  PACKER_BOOTSTRAP = fn.system {
    "git",
    "clone",
    "--depth",
    "1",
    "https://github.com/wbthomason/packer.nvim",
    install_path,
  }
  print "Installing packer close and reopen Neovim..."
  vim.cmd [[packadd packer.nvim]]
end

-- Autocommand that reloads neovim whenever you save the plugins.lua file
vim.cmd [[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]]

-- Use a protected call so we don't error out on first use
local status_ok, packer = pcall(require, "packer")
if not status_ok then
  return
end

-- Have packer use a popup window
packer.init {
  display = {
    open_fn = function()
      return require("packer.util").float { border = "rounded" }
    end,
  },
}

-- Install your plugins here
return packer.startup(function(use)

  -- Neccesary plugins here
  use "wbthomason/packer.nvim" -- Have packer manage itself
  use "nvim-lua/popup.nvim" -- An implementation of the Popup API from vim in Neovim
  use "nvim-lua/plenary.nvim" -- Useful lua functions used by lots of plugins

  -- PLUGINS --
  use "windwp/nvim-autopairs"
  use 'nvim-lualine/lualine.nvim'
  use 'kyazdani42/nvim-tree.lua'
  use 'norcalli/nvim-colorizer.lua'
  use 'sudormrfbin/cheatsheet.nvim' -- :Cheatsheet
  use 'akinsho/bufferline.nvim'
  use 'nvim-telescope/telescope-ui-select.nvim'

  -- Software Development
  --use 'folke/todo-comments.nvim'
  use 'numToStr/Comment.nvim'
  --use 'ggandor/lightspeed.nvim' -- TODO: learn how to use these plugins

  -- Languages
  use 'simrat39/rust-tools.nvim'
  use 'Saecki/crates.nvim'
  use 'dag/vim-fish'
  use 'LnL7/vim-nix'

  -- CMP
  use "hrsh7th/nvim-cmp" -- The completion plugin
  use "hrsh7th/cmp-buffer" -- buffer completions
  use "hrsh7th/cmp-path" -- path completions
  use "hrsh7th/cmp-cmdline" -- cmdline completions
  use "hrsh7th/cmp-nvim-lsp"
  use "hrsh7th/cmp-nvim-lua"
  use 'lukas-reineke/cmp-rg'
  use 'kdheepak/cmp-latex-symbols'
  use { 'tzachar/cmp-fuzzy-path', requires = { 'hrsh7th/nvim-cmp', 'tzachar/fuzzy.nvim' } }
  use {
    "mtoohey31/cmp-fish",
    ft = 'fish'
  }

  -- Snippets
  use 'L3MON4D3/LuaSnip'


  -- Telescope
  use "nvim-telescope/telescope.nvim"
  use 'nvim-telescope/telescope-media-files.nvim'
  use { 'nvim-telescope/telescope-fzf-native.nvim', run = 'make' }
  -- Treesitter
  use {
    "nvim-treesitter/nvim-treesitter",
    run = ":TSUpdate",
  }
  use "p00f/nvim-ts-rainbow"
  use "nvim-treesitter/playground"
  -- LSP
  use "neovim/nvim-lspconfig" -- enable LSP
  use "williamboman/nvim-lsp-installer" -- simple to use language server installer


  -- Session
  use {
    'goolord/alpha-nvim',
    requires = { 'kyazdani42/nvim-web-devicons' },
  }
  use 'Shatur/neovim-session-manager'

  -- Colorscheme
  use 'folke/tokyonight.nvim'
  use 'catppuccin/nvim'
  use 'haishanh/night-owl.vim'
  use 'Shatur/neovim-ayu'
  use 'tiagovla/tokyodark.nvim'
  use 'marko-cerovac/material.nvim'
  use 'EdenEast/nightfox.nvim'
  use 'Mofiqul/dracula.nvim'
  use 'yashguptaz/calvera-dark.nvim'
  use 'bluz71/vim-moonfly-colors'
  use 'navarasu/onedark.nvim'
  use 'shaunsingh/moonlight.nvim'
  use 'CaesarXInsanium/calveradark.nvim'

  -- Automatically set up your configuration after cloning packer.nvim
  -- Put this at the end after all plugins
  if PACKER_BOOTSTRAP then
    require("packer").sync()
  end
end)
